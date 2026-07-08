from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from library.models import ReadingHistory
from .models import Chapter, Genre, Story, StoryStatus, Tags
from .serializers import GenreSerializer


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
    genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), required=False, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    tag_names = serializers.SerializerMethodField(read_only=True)
    author_name = serializers.SerializerMethodField(read_only=True)
    genre_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Story
        fields = [
            "id", "title", "synopsis", "author", "author_name", "genre", "genre_name",
            "tags", "tag_names", "image", "is_mature", "status", "published_at",
            "chapter_count", "views", "likes", "comments_count", "favorites_count",
            "created_at", "updated_at"
        ]
        read_only_fields = ["id", "author", "author_name", "genre_name", "tag_names", "published_at", "created_at", "updated_at", "views", "likes", "comments_count", "favorites_count"]

    def get_tag_names(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def get_author_name(self, obj):
        return obj.author.username if obj.author else None

    def get_genre_name(self, obj):
        return obj.genre.name if obj.genre else None

    def create(self, validated_data):
        tags_data = validated_data.pop("tags", [])
        request = self.context.get("request")
        story = Story.objects.create(author=request.user, **validated_data)
        self._sync_tags(story, tags_data)
        return story

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags_data is not None:
            self._sync_tags(instance, tags_data)
        return instance

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
        queryset = self.queryset
        if self.action in {"mine", "drafts"}:
            if not self.request.user.is_authenticated:
                return Story.objects.none()
            return queryset.filter(author=self.request.user).order_by("-created_at")

        if self.request.user.is_authenticated and self.request.query_params.get("mine") == "1":
            return queryset.filter(author=self.request.user).order_by("-created_at")

        queryset = queryset.filter(status=StoryStatus.PUBLISHED)

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

        return queryset.order_by("-published_at" if self.request.query_params.get("sort") == "latest" else "-created_at")

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
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
        queryset = self.get_queryset().order_by("-views", "-likes")[:12]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="latest")
    def latest(self, request):
        queryset = self.get_queryset().order_by("-published_at")[:12]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="popular")
    def popular(self, request):
        queryset = self.get_queryset().order_by("-likes", "-views")[:12]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="featured")
    def featured(self, request):
        queryset = self.get_queryset().order_by("-likes")[:8]
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
        story.publish()
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
        return Story.objects.filter(author_id=self.kwargs["author_id"], status=StoryStatus.PUBLISHED).select_related("author", "genre").prefetch_related("tags").order_by("-created_at")


class ChapterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ["id", "story", "title", "chapter_number", "content", "order", "created_at", "updated_at"]
        read_only_fields = ["id", "story", "created_at", "updated_at"]


class StoryChapterListCreateAPIView(ListCreateAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs["story_id"])
        if story.status != StoryStatus.PUBLISHED and (not self.request.user.is_authenticated or story.author_id != self.request.user.id):
            raise Http404
        return story.chapters.all()

    def perform_create(self, serializer):
        story = get_object_or_404(Story, pk=self.kwargs["story_id"])
        if not self.request.user.is_authenticated or story.author_id != self.request.user.id:
            raise permissions.PermissionDenied("You can only manage your own story chapters.")
        serializer.save(story=story)


class StoryChapterDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ChapterSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        story = get_object_or_404(Story, pk=self.kwargs["story_id"])
        if story.status != StoryStatus.PUBLISHED and (not self.request.user.is_authenticated or story.author_id != self.request.user.id):
            raise Http404
        return story.chapters.all()

    def perform_update(self, serializer):
        chapter = self.get_object()
        if not self.request.user.is_authenticated or chapter.story.author_id != self.request.user.id:
            raise permissions.PermissionDenied("You can only manage your own story chapters.")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_authenticated or instance.story.author_id != self.request.user.id:
            raise permissions.PermissionDenied("You can only manage your own story chapters.")
        instance.delete()
