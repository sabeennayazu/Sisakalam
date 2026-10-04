from django.contrib.contenttypes.models import ContentType
from django.db import IntegrityError, transaction
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from poems.models import Poem
from stories.models import Genre, Story
from .models import (
    DailyActiveUser,
    GenrePopularity,
    PoemImpression,
    ReadingDuration,
    RecommendationClick,
    StoryImpression,
)


def _sync_content_view_count(model, instance):
    if model is Story:
        instance.views = instance.impressions.count()
    elif model is Poem:
        instance.views = instance.impressions.count()
    instance.save(update_fields=["views"])
    return instance.views


class StoryViewEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        if request.user.is_authenticated and story.author_id == request.user.id:
            return Response({"viewed": False, "is_new_view": False, "views_count": story.views})

        created = False
        with transaction.atomic():
            if request.user.is_authenticated:
                try:
                    _, created = StoryImpression.objects.get_or_create(story=story, user=request.user)
                except IntegrityError:
                    created = False
            else:
                StoryImpression.objects.create(
                    story=story,
                    user=None,
                    ip_address=request.META.get("REMOTE_ADDR"),
                )
                created = True

        story.views = _sync_content_view_count(Story, story)
        return Response({
            "viewed": True,
            "is_new_view": created,
            "views_count": story.views,
        })


class PoemViewEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        poem = get_object_or_404(Poem, pk=pk)
        if request.user.is_authenticated and poem.author_id == request.user.id:
            return Response({"viewed": False, "is_new_view": False, "views_count": poem.views})

        created = False
        with transaction.atomic():
            if request.user.is_authenticated:
                try:
                    _, created = PoemImpression.objects.get_or_create(poem=poem, user=request.user)
                except IntegrityError:
                    created = False
            else:
                PoemImpression.objects.create(
                    poem=poem,
                    user=None,
                    ip_address=request.META.get("REMOTE_ADDR"),
                )
                created = True

        poem.views = _sync_content_view_count(Poem, poem)
        return Response({
            "viewed": True,
            "is_new_view": created,
            "views_count": poem.views,
        })


class ReadingDurationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        target_type = request.data.get("target_type")
        target_id = request.data.get("target_id")
        duration_seconds = request.data.get("duration_seconds", 0)
        if not target_type or not target_id or not duration_seconds:
            return Response({"detail": "Invalid payload."}, status=status.HTTP_400_BAD_REQUEST)
        model = Story if target_type == "story" else Poem if target_type == "poem" else None
        if not model:
            return Response({"detail": "Unsupported target type."}, status=status.HTTP_400_BAD_REQUEST)
        target = get_object_or_404(model, pk=target_id)
        ReadingDuration.objects.create(
            user=request.user if request.user.is_authenticated else None,
            target_content_type=ContentType.objects.get_for_model(model),
            target_object_id=target.id,
            duration_seconds=duration_seconds,
        )
        return Response({"detail": "Reading duration recorded."})


class RecommendationClickView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        source = request.data.get("source", "home")
        target_type = request.data.get("target_type")
        target_id = request.data.get("target_id")
        if not target_type or not target_id:
            return Response({"detail": "Invalid payload."}, status=status.HTTP_400_BAD_REQUEST)
        model = Story if target_type == "story" else Poem if target_type == "poem" else None
        if not model:
            return Response({"detail": "Unsupported target type."}, status=status.HTTP_400_BAD_REQUEST)
        target = get_object_or_404(model, pk=target_id)
        RecommendationClick.objects.create(
            user=request.user if request.user.is_authenticated else None,
            recommendation_source=source,
            target_content_type=ContentType.objects.get_for_model(model),
            target_object_id=target.id,
        )
        return Response({"detail": "Recommendation click recorded."})


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "stories_count": Story.objects.filter(author=request.user).count(),
            "poems_count": Poem.objects.filter(author=request.user).count(),
            "total_views": Story.objects.filter(author=request.user).aggregate(total=Sum("views"))["total"] or 0,
        })


class PopularGenresView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stats = GenrePopularity.objects.select_related("genre").order_by("-total_views")[:10]
        return Response([
            {"id": item.genre_id, "name": item.genre.name, "total_views": item.total_views}
            for item in stats
        ])


class PopularStoriesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stories = Story.objects.filter(status="published").order_by("-views", "-likes")[:10]
        return Response([
            {"id": story.id, "title": story.title, "views": story.views, "likes": story.likes}
            for story in stories
        ])


class PopularPoemsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        poems = Poem.objects.filter(status="published").order_by("-views", "-likes")[:10]
        return Response([
            {"id": poem.id, "title": poem.title, "views": poem.views, "likes": poem.likes}
            for poem in poems
        ])
