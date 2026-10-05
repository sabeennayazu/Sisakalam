from django.db import transaction
from django.db.models import Avg, F, Max, Q, Value
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from library.models import ReadingHistory
from interactions.querysets import annotate_content_interactions
from .models import Chapter, Genre, Story, StoryStatus, Tags
from .serializers import GenreSerializer
from notifications.services import notify_followers


def _notify_story_published(story):
    if not story.is_private:
        notify_followers(
            author=story.author,
            notification_type="new_story",
            message="published a new story",
            target=story,
        )


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and obj.author_id == request.user.id


class StorySerializer(serializers.ModelSerializer):
    synopsis = serializers.CharField(required=False, allow_blank=True)
    genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), required=False, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    tag_names = serializers.SerializerMethodField(read_only=True)
    author_name = serializers.SerializerMethodField(read_only=True)
    author_profile_picture = serializers.SerializerMethodField(read_only=True)
    genre_name = serializers.SerializerMethodField(read_only=True)
    chapter_count = serializers.SerializerMethodField(read_only=True)
    content = serializers.CharField(write_only=True, required=False, allow_blank=True)
    first_chapter_slug = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = [
            "id", "title", "synopsis", "author", "author_name", "author_profile_picture", "genre", "genre_name",
            "tags", "tag_names", "image", "is_mature", "is_private", "status", "published_at",
            "content", "first_chapter_slug",
            "chapter_count", "views", "likes", "comments_count", "favorites_count", "is_liked", "is_bookmarked",
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "author", "author_name", "genre_name", "tag_names", "published_at", "created_at", "updated_at", "views", "likes", "comments_count", "favorites_count"]

    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def get_author_name(self, obj):
        return obj.author.username if obj.author else None

    def get_author_profile_picture(self, obj):
        request = self.context.get("request")
        if not obj.author or not obj.author.profile_picture:
            return None
        return request.build_absolute_uri(obj.author.profile_picture.url) if request else obj.author.profile_picture.url

    def get_genre_name(self, obj):
        return obj.genre.name if obj.genre else None

    def get_chapter_count(self, obj):
        return obj.chapters.count()

    def get_first_chapter_slug(self, obj):
        chapter = obj.chapters.order_by("order").first()
        return chapter.slug if chapter else None

    def get_likes(self, obj):
        count = getattr(obj, "api_likes_count", None)
        return count if count is not None else obj.likes_received.count()

    def get_comments_count(self, obj):
        count = getattr(obj, "api_comments_count", None)
        return count if count is not None else obj.comments.count()

    def get_is_liked(self, obj):
        return bool(getattr(obj, "api_is_liked", False))

    def get_is_bookmarked(self, obj):
        return bool(getattr(obj, "api_is_bookmarked", False))

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        content = validated_data.pop("content", "")
        request = self.context.get("request")
        if validated_data.get("status") == StoryStatus.PUBLISHED and not content.strip():
            raise serializers.ValidationError({"content": "Write the first chapter before publishing this story."})
        with transaction.atomic():
            story = Story.objects.create(author=request.user, **validated_data)
            self._sync_tags(story, tags_data)
            self._create_initial_chapter(story, content)
            if story.status == StoryStatus.PUBLISHED:
                story.publish()
                _notify_story_published(story)
        return story

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)
        content = validated_data.pop("content", None)
        with transaction.atomic():
            instance = Story.objects.select_for_update().get(pk=instance.pk)
            was_draft = instance.status == StoryStatus.DRAFT
            was_published = instance.status == StoryStatus.PUBLISHED
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            if instance.status == StoryStatus.PUBLISHED and not instance.chapters.exists() and not (content or "").strip():
                raise serializers.ValidationError({"content": "Write the first chapter before publishing this story."})
            instance.save()
            if tags_data is not None:
                self._sync_tags(instance, tags_data)
            if content is not None and was_draft:
                first_chapter = instance.chapters.order_by("order").first()
                if first_chapter:
                    first_chapter.title = instance.title
                    first_chapter.content = content
                    first_chapter.save(update_fields=["title", "content", "updated_at"])
                else:
                    self._create_initial_chapter(instance, content)
            elif content is not None:
                self._create_initial_chapter(instance, content)
            if instance.status == StoryStatus.PUBLISHED and not was_published:
                instance.publish()
                _notify_story_published(instance)
        return instance

    def _create_initial_chapter(self, story, content):
        if content.strip() and not story.chapters.exists():
            Chapter.objects.create(
                story=story,
                title=story.title,
                chapter_number=1,
                order=1,
                content=content,
            )
            Story.objects.filter(pk=story.pk).update(chapter_count=1)

    def _sync_tags(self, story, tag_names):
        tag_objs = []
        for name in tag_names:
            tag_obj, _ = Tags.objects.get_or_create(name=name.strip().lower())
            tag_objs.append(tag_obj)
        story.tags.set(tag_objs)


class GenreListView(ListAPIView):
    """
    GET /api/stories/genres/
    Optional query param: ?type=story or ?type=poem
    Returns genres filtered by type, or all genres if no type is given.
    """
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Genre.objects.all().order_by("name")
        genre_type = self.request.query_params.get("type")
        if genre_type in ("story", "poem"):
            queryset = queryset.filter(type=genre_type)
        return queryset


class StoryViewSet(viewsets.ModelViewSet):
    serializer_class = StorySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Story.objects.select_related("author", "genre").prefetch_related("tags")

    def get_permissions(self):
        if self.action in {"create"}:
            return [IsAuthenticated()]
        if self.action in {"update", "partial_update", "destroy", "publish", "unpublish"}:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = annotate_content_interactions(self.queryset, "story", self.request.user)
        if self.action in {"update", "partial_update", "destroy", "publish", "unpublish"}:
            if not self.request.user.is_authenticated:
                return Story.objects.none()
            return queryset.filter(author=self.request.user).order_by("-created_at")

        if self.action in {"mine", "drafts"}:
            if not self.request.user.is_authenticated:
                return Story.objects.none()
            return queryset.filter(author=self.request.user).order_by("-created_at")

        if self.request.user.is_authenticated and self.request.query_params.get("mine") == "1":
            return queryset.filter(author=self.request.user).order_by("-created_at")

        queryset = queryset.filter(status=StoryStatus.PUBLISHED, is_private=False)

        search = self.request.query_params.get("q", "").strip()
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(synopsis__icontains=search))

        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genre__name__icontains=genre)

        tag = self.request.query_params.get("tag")
        if tag:
            queryset = queryset.filter(tags__name__icontains=tag)

        author_id = self.request.query_params.get("author")
        if author_id:
            queryset = queryset.filter(author_id=author_id)

        status_filter = self.request.query_params.get("status")
        if status_filter in {StoryStatus.DRAFT, StoryStatus.PUBLISHED}:
            queryset = queryset.filter(status=status_filter)

        sort_key = (self.request.query_params.get("sort") or "newest").strip().lower()
        if sort_key == "latest":
            sort_key = "newest"

        queryset = queryset.annotate(
            popularity_score=(F("views") + (F("api_likes_count") * Value(3)) + (F("api_comments_count") * Value(2))),
            api_average_rating=Avg("comments__rating"),
        )

        sort_map = {
            "popular": ["-popularity_score", "-views", "-api_likes_count", "-api_comments_count", "-published_at"],
            "most_liked": ["-api_likes_count", "-views", "-api_comments_count", "-published_at"],
            "most_commented": ["-api_comments_count", "-views", "-api_likes_count", "-published_at"],
            "newest": ["-published_at", "-created_at"],
            "recently_updated": ["-updated_at", "-published_at"],
            "highest_rated": ["-api_average_rating", "-api_comments_count", "-published_at"],
        }
        return queryset.order_by(*sort_map.get(sort_key, sort_map["newest"]))

    def get_object(self):
        queryset = annotate_content_interactions(self.queryset, "story", self.request.user)
        if self.request.user.is_authenticated:
            queryset = queryset.filter(Q(status=StoryStatus.PUBLISHED, is_private=False) | Q(author=self.request.user))
        else:
            queryset = queryset.filter(status=StoryStatus.PUBLISHED, is_private=False)

        obj = get_object_or_404(queryset, pk=self.kwargs["pk"])
        if obj.status != StoryStatus.PUBLISHED and (not self.request.user.is_authenticated or obj.author_id != self.request.user.id):
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=["get"], url_path="mine")
    def mine(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page or queryset, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="trending")
    def trending(self, request):
        queryset = self.get_queryset().order_by("-views", "-api_likes_count")[:12]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="latest")
    def latest(self, request):
        queryset = self.get_queryset().order_by("-published_at")[:12]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="popular")
    def popular(self, request):
        queryset = self.get_queryset().order_by("-api_likes_count", "-views")[:12]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="featured")
    def featured(self, request):
        queryset = self.get_queryset().order_by("-api_likes_count")[:8]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="recommendations")
    def recommendations(self, request):
        queryset = self.get_queryset().exclude(author=request.user if request.user.is_authenticated else None).order_by("-created_at")[:8]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        story = self.get_object()
        if story.status == StoryStatus.PUBLISHED:
            return Response({"detail": "Story is already published."}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            story = Story.objects.select_for_update().get(pk=story.pk)
            if not story.chapters.exists():
                return Response({"detail": "Add a first chapter before publishing this story."}, status=status.HTTP_400_BAD_REQUEST)
            story.publish()
            _notify_story_published(story)
        return Response(self.get_serializer(story).data)

    @action(detail=True, methods=["post"], url_path="unpublish")
    def unpublish(self, request, pk=None):
        story = self.get_object()
        story.status = StoryStatus.DRAFT
        story.published_at = None
        story.save(update_fields=["status", "published_at"])
        return Response(self.get_serializer(story).data)

    @action(detail=False, methods=["get"], url_path="continue-reading")
    def continue_reading(self, request):
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
        history = ReadingHistory.objects.filter(user=request.user, story__isnull=False).select_related("story").order_by("-last_read_at")[:1]
        if not history.exists():
            return Response({"detail": "No reading history yet."}, status=status.HTTP_404_NOT_FOUND)
        entry = history.first()
        return Response({
            "id": entry.id,
            "story_id": entry.story_id,
            "title": entry.story.title,
            "progress_percent": entry.progress_percent,
            "completed": entry.completed,
        })


class AuthorStoryListView(ListAPIView):
    serializer_class = StorySerializer
    permission_classes = [AllowAny]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        queryset = Story.objects.filter(author_id=self.kwargs["author_id"], status=StoryStatus.PUBLISHED, is_private=False).select_related("author", "genre").prefetch_related("tags")
        return annotate_content_interactions(queryset, "story", self.request.user).order_by("-created_at")


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "story", "title", "slug", "chapter_number", "content", "order", "created_at", "updated_at"]
        read_only_fields = ["id", "story", "slug", "chapter_number", "order", "created_at", "updated_at"]


class ChapterSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "story", "title", "slug", "chapter_number", "order", "created_at", "updated_at"]
        read_only_fields = fields


class StoryChapterListCreateAPIView(ListCreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_serializer_class(self):
        if self.request.method == "GET" and self.request.query_params.get("metadata") == "1":
            return ChapterSummarySerializer
        return super().get_serializer_class()

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs["story_id"])
        if (story.status != StoryStatus.PUBLISHED or story.is_private) and (not self.request.user.is_authenticated or story.author_id != self.request.user.id):
            raise Http404
        return story.chapters.all().order_by("chapter_number")

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if request.query_params.get("around") is not None:
            try:
                around = int(request.query_params["around"])
            except ValueError:
                return Response({"detail": "around must be an integer chapter number."}, status=status.HTTP_400_BAD_REQUEST)
            before = max(0, int(request.query_params.get("before") or 5))
            after = max(0, int(request.query_params.get("after") or 5))
            max_number = queryset.count() and queryset.order_by("-chapter_number").first().chapter_number or 0
            window_start = max(1, around - before)
            window_end = min(max_number, around + after)
            filtered_queryset = queryset.filter(chapter_number__gte=window_start, chapter_number__lte=window_end)
            serializer = self.get_serializer(filtered_queryset, many=True)
            current = queryset.filter(chapter_number=around).first()
            return Response({
                "total_chapters": queryset.count(),
                "current_chapter_number": around,
                "current_chapter": self.get_serializer(current).data if current else None,
                "has_previous": around > 1,
                "has_next": around < max_number,
                "chapters": serializer.data,
            })
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        with transaction.atomic():
            story = get_object_or_404(Story.objects.select_for_update(), pk=self.kwargs["story_id"])
            if not self.request.user.is_authenticated or story.author_id != self.request.user.id:
                raise PermissionDenied("You can only manage your own story chapters.")
            next_number = (story.chapters.aggregate(max_number=Max("chapter_number"))["max_number"] or 0) + 1
            chapter = serializer.save(story=story, chapter_number=next_number, order=next_number)
            Story.objects.filter(pk=story.pk).update(chapter_count=story.chapters.count())
            if story.status == StoryStatus.PUBLISHED and not story.is_private:
                notify_followers(
                    author=story.author,
                    notification_type="new_chapter",
                    message=f"added Chapter {chapter.chapter_number}",
                    target=chapter,
                )


class StoryChapterDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs["story_id"])
        if (story.status != StoryStatus.PUBLISHED or story.is_private) and (not self.request.user.is_authenticated or story.author_id != self.request.user.id):
            raise Http404
        return story.chapters.all()

    def perform_update(self, serializer):
        chapter = self.get_object()
        if not self.request.user.is_authenticated or chapter.story.author_id != self.request.user.id:
            raise PermissionDenied("You can only manage your own story chapters.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_authenticated or instance.story.author_id != self.request.user.id:
            raise PermissionDenied("You can only manage your own story chapters.")
        with transaction.atomic():
            story = Story.objects.select_for_update().get(pk=instance.story_id)
            instance.delete()
            Story.objects.filter(pk=story.pk).update(chapter_count=story.chapters.count())


class StoryChapterBySlugAPIView(RetrieveAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs["story_id"])
        if (story.status != StoryStatus.PUBLISHED or story.is_private) and (
            not self.request.user.is_authenticated or story.author_id != self.request.user.id
        ):
            raise Http404
        return story.chapters.all()

    def get_object(self):
        return get_object_or_404(self.get_queryset(), slug=self.kwargs["slug"])
