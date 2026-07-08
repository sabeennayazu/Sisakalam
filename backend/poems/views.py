from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from stories.models import Genre, Tags
from .models import Poem, PoemStatus


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and obj.author_id == request.user.id


class PoemSerializer(serializers.ModelSerializer):
    genre = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), required=False, allow_null=True)
    tags = serializers.ListField(child=serializers.CharField(), write_only=True, required=False)
    tag_names = serializers.SerializerMethodField(read_only=True)
    author_name = serializers.SerializerMethodField(read_only=True)
    genre_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Poem
        fields = [
            "id", "title", "content", "author", "author_name", "genre", "genre_name",
            "tags", "tag_names", "image", "is_mature", "status", "published_at",
            "views", "likes", "comments_count", "favorites_count", "created_at", "updated_at"
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
        poem = Poem.objects.create(author=request.user, **validated_data)
        self._sync_tags(poem, tags_data)
        return poem

    def update(self, instance, validated_data):
        tags_data = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if tags_data is not None:
            self._sync_tags(instance, tags_data)
        return instance

    def _sync_tags(self, poem, tag_names):
        tag_objs = []
        for name in tag_names:
            tag_obj, _ = Tags.objects.get_or_create(name=name.strip().lower())
            tag_objs.append(tag_obj)
        poem.tags.set(tag_objs)


class PoemViewSet(viewsets.ModelViewSet):
    queryset = Poem.objects.select_related("author", "genre").prefetch_related("tags")
    serializer_class = PoemSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_permissions(self):
        if self.action in {"create"}:
            return [IsAuthenticated()]
        if self.action in {"update", "partial_update", "destroy", "publish", "unpublish"}:
            return [IsAuthenticated(), IsOwnerOrReadOnly()]
        return [AllowAny()]

    def get_queryset(self):
        queryset = self.queryset
        if self.action in {"mine"}:
            if not self.request.user.is_authenticated:
                return Poem.objects.none()
            return queryset.filter(author=self.request.user).order_by("-created_at")

        if self.request.user.is_authenticated and self.request.query_params.get("mine") == "1":
            return queryset.filter(author=self.request.user).order_by("-created_at")

        queryset = queryset.filter(status=PoemStatus.PUBLISHED)

        search = self.request.query_params.get("q", "").strip()
        if search:
            queryset = queryset.filter(Q(title__icontains=search) | Q(content__icontains=search))

        genre = self.request.query_params.get("genre")
        if genre:
            queryset = queryset.filter(genre__name__icontains=genre)

        tag = self.request.query_params.get("tag")
        if tag:
            queryset = queryset.filter(tags__name__icontains=tag)

        author_id = self.request.query_params.get("author")
        if author_id:
            queryset = queryset.filter(author_id=author_id)

        return queryset.order_by("-published_at" if self.request.query_params.get("sort") == "latest" else "-created_at")

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        if obj.status != PoemStatus.PUBLISHED and (not self.request.user.is_authenticated or obj.author_id != self.request.user.id):
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj

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

    @action(detail=False, methods=["get"], url_path="recommendations")
    def recommendations(self, request):
        queryset = self.get_queryset().exclude(author=request.user if request.user.is_authenticated else None).order_by("-created_at")[:8]
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], url_path="publish")
    def publish(self, request, pk=None):
        poem = self.get_object()
        if poem.status == PoemStatus.PUBLISHED:
            return Response({"detail": "Poem is already published."}, status=status.HTTP_400_BAD_REQUEST)
        poem.publish()
        return Response(self.get_serializer(poem).data)

    @action(detail=True, methods=["post"], url_path="unpublish")
    def unpublish(self, request, pk=None):
        poem = self.get_object()
        poem.status = PoemStatus.DRAFT
        poem.published_at = None
        poem.save(update_fields=["status", "published_at"])
        return Response(self.get_serializer(poem).data)
