from difflib import SequenceMatcher
import re

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import connection, transaction
from django.db.models import Case, Count, FloatField, Q, Value, When
from django.db.models.functions import Greatest
from django.http import QueryDict
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from poems.models import Poem, PoemStatus
from stories.models import Story, StoryStatus


User = get_user_model()


def _absolute_image(request, image):
    return request.build_absolute_uri(image.url) if image else None


def _postgres_search(queryset, query, fields, text_fields, page, page_size):
    from django.contrib.postgres.search import (
        SearchQuery,
        SearchRank,
        SearchVector,
        TrigramSimilarity,
        TrigramWordSimilarity,
    )

    search_query = SearchQuery(query, search_type="plain", config="simple")
    vector = SearchVector(text_fields[0], config="simple", weight="A")
    for index, field in enumerate(text_fields[1:], start=1):
        weight = "B" if index == 1 else "C"
        vector += SearchVector(field, config="simple", weight=weight)

    matched_fields = Q()
    for field in fields:
        matched_fields |= Q(**{f"{field}__trigram_similar": query})
        matched_fields |= Q(**{f"{field}__trigram_word_similar": query})

    queryset = queryset.annotate(
        search_rank=SearchRank(vector, search_query),
        exact_match=Case(
            When(**{f"{fields[0]}__iexact": query}, then=Value(1.0)),
            default=Value(0.0),
            output_field=FloatField(),
        ),
        primary_similarity=TrigramSimilarity(fields[0], query),
        word_similarity=Greatest(*[
            TrigramWordSimilarity(query, field) for field in fields
        ]),
    ).filter(Q(search_rank__gt=0) | matched_fields)
    count = queryset.order_by().values("pk").distinct().count()
    results = list(
        queryset.distinct().order_by(
            "-exact_match", "-primary_similarity", "-search_rank", "-word_similarity", "-pk",
        )[(page - 1) * page_size:page * page_size]
    )
    return results, count, page * page_size < count


def _sqlite_search(queryset, query, fields, page, page_size):
    minimum_similarity = float(settings.SEARCH_SQLITE_RATIO_THRESHOLD)
    matches = []
    normalized_query = query.casefold()
    for result in queryset:
        values = [
            str(getattr(result, field) or "")
            for field in fields
            if "__" not in field
        ]
        if hasattr(result, "genre") and result.genre:
            values.append(result.genre.name)
        if hasattr(result, "tags"):
            values.extend(tag.name for tag in result.tags.all())
        if hasattr(result, "author") and result.author:
            values.append(result.author.username)

        candidates = [
            candidate
            for value in values
            for candidate in [value, *re.findall(r"[\w]+", value)]
        ]
        similarity = max(
            (SequenceMatcher(None, normalized_query, value.casefold()).ratio() for value in candidates),
            default=0,
        )
        exact = any(normalized_query == value.casefold() for value in candidates)
        partial = any(normalized_query in value.casefold() for value in candidates)
        if exact or partial or similarity >= minimum_similarity:
            matches.append((result, exact, similarity))

    matches.sort(key=lambda item: (not item[1], -item[2], -item[0].pk))
    count = len(matches)
    start = (page - 1) * page_size
    return [item[0] for item in matches[start:start + page_size]], count, page * page_size < count


def _page_parameters(request):
    try:
        page = max(1, int(request.query_params.get("page", 1)))
        page_size = max(1, min(50, int(request.query_params.get("limit", 3))))
    except (TypeError, ValueError):
        page, page_size = 1, 3
    return page, page_size


def _search_queryset(queryset, query, fields, text_fields, page, page_size):
    if connection.vendor == "postgresql":
        return _postgres_search(queryset, query, fields, text_fields, page, page_size)
    return _sqlite_search(queryset, query, fields, page, page_size)


def _content_result(item, request, content_type):
    return {
        "id": item.pk,
        "type": content_type,
        "title": item.title,
        "author": item.author.username,
        "author_id": item.author_id,
        "author_profile_picture": _absolute_image(request, item.author.profile_picture),
        "genre": item.genre.name if item.genre else "",
        "image": _absolute_image(request, item.image),
        "description": item.synopsis if content_type == "story" else item.content[:500],
        "views": item.views,
        "likes": item.search_likes,
        "comments": item.search_comments,
        "is_mature": item.is_mature,
        "tags": [tag.name for tag in item.tags.all()],
        "created_at": item.created_at,
    }


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "").strip()[:100]
        page, page_size = _page_parameters(request)
        if not query:
            return Response({
                "query": "", "stories": [], "poems": [], "users": [],
                "total": 0, "counts": {"stories": 0, "poems": 0, "users": 0},
                "page": page, "limit": page_size,
                "has_more": {"stories": False, "poems": False, "users": False},
            })

        stories = Story.objects.filter(
            status=StoryStatus.PUBLISHED,
            is_private=False,
            author__is_active=True,
        ).select_related("author", "genre").prefetch_related("tags").annotate(
            search_likes=Count("likes_received", distinct=True),
            search_comments=Count("comments", distinct=True),
        )
        poems = Poem.objects.filter(
            status=PoemStatus.PUBLISHED,
            is_private=False,
            author__is_active=True,
        ).select_related("author", "genre").prefetch_related("tags").annotate(
            search_likes=Count("likes_received", distinct=True),
            search_comments=Count("comments", distinct=True),
        )

        user_visibility = Q(privacy_preferences__isnull=True) | Q(privacy_preferences__show_in_search=True)
        if request.user.is_authenticated:
            user_visibility &= Q(pk=request.user.pk) | Q(is_private=False) | Q(followers_set__follower_id=request.user.pk)
        else:
            user_visibility &= Q(is_private=False)
        users = User.objects.filter(is_active=True).filter(user_visibility).distinct()
        users = users.only("id", "username", "profile_picture", "is_private").distinct()

        with transaction.atomic():
            if connection.vendor == "postgresql":
                threshold = float(settings.SEARCH_TRIGRAM_SIMILARITY_THRESHOLD)
                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT set_config('pg_trgm.similarity_threshold', %s, true)",
                        [str(threshold)],
                    )

            story_rows, story_count, story_more = _search_queryset(
                stories, query,
                ["title", "synopsis", "author__username", "genre__name", "tags__name"],
                ["title", "author__username", "synopsis", "genre__name", "tags__name"], page, page_size,
            )
            poem_rows, poem_count, poem_more = _search_queryset(
                poems, query,
                ["title", "content", "author__username", "genre__name", "tags__name"],
                ["title", "author__username", "content", "genre__name", "tags__name"], page, page_size,
            )
            user_rows, user_count, user_more = _search_queryset(
                users, query, ["username"], ["username"], page, page_size,
            )
            response_stories = [_content_result(item, request, "story") for item in story_rows]
            response_poems = [_content_result(item, request, "poem") for item in poem_rows]
            response_users = [{
                "id": item.pk,
                "username": item.username,
                "profile_picture": _absolute_image(request, item.profile_picture),
            } for item in user_rows]

        return Response({
            "query": query,
            "stories": response_stories,
            "poems": response_poems,
            "users": response_users,
            "total": story_count + poem_count + user_count,
            "counts": {
                "stories": story_count,
                "poems": poem_count,
                "users": user_count,
            },
            "page": page,
            "limit": page_size,
            "has_more": {
                "stories": story_more,
                "poems": poem_more,
                "users": user_more,
            },
        })