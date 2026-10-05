from django.db import transaction
from django.db.models import Count, Exists, OuterRef, Prefetch, Q, Subquery
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from stories.models import Chapter, Story
from poems.models import Poem
from .models import Comment, Like, Bookmark
from rest_framework import serializers
from .serializers import LikeSerializer, BookmarkSerializer
from stories.models import StoryStatus
from poems.models import PoemStatus
from .querysets import annotate_content_interactions
from notifications.services import create_notification


def _content_queryset(model, target_field, user):
    queryset = model.objects.select_related("author", "genre")
    queryset = annotate_content_interactions(queryset, target_field, user)
    if target_field == "story":
        first_chapter = Chapter.objects.filter(story_id=OuterRef("pk")).order_by("order").values("slug")[:1]
        queryset = queryset.annotate(api_first_chapter_slug=Subquery(first_chapter))
    return queryset


def _content_payload(content, content_type):
    return {
        "content_id": content.id,
        "content_type": content_type,
        "title": content.title,
        "author_name": content.author.username if content.author else None,
        "author_id": content.author_id,
        "author_profile_picture": content.author.profile_picture.url if content.author and content.author.profile_picture else None,
        "chapter_slug": getattr(content, "api_first_chapter_slug", None) if content_type == "story" else None,
        "genre_name": content.genre.name if content.genre else None,
        "image": content.image.url if content.image else None,
        "views": content.views,
        "likes": getattr(content, "api_likes_count", 0),
        "comments_count": getattr(content, "api_comments_count", 0),
        "is_liked": getattr(content, "api_is_liked", False),
        "is_bookmarked": getattr(content, "api_is_bookmarked", False),
        "is_mature": content.is_mature,
        "is_private": getattr(content, "is_private", False),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def bookmarked_content(request):
    bookmarks = Bookmark.objects.filter(user=request.user, story__isnull=False).prefetch_related(
        Prefetch("story", queryset=_content_queryset(Story, "story", request.user)),
    ).order_by("-created_at")
    poem_bookmarks = Bookmark.objects.filter(user=request.user, poem__isnull=False).prefetch_related(
        Prefetch("poem", queryset=_content_queryset(Poem, "poem", request.user)),
    ).order_by("-created_at")
    return Response([
        item for _, item in sorted(
            [(bookmark.created_at, _content_payload(bookmark.story, "story")) for bookmark in bookmarks]
            + [(bookmark.created_at, _content_payload(bookmark.poem, "poem")) for bookmark in poem_bookmarks],
            key=lambda pair: pair[0],
            reverse=True,
        )
    ])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def liked_content(request):
    story_likes = Like.objects.filter(user=request.user, story__isnull=False).prefetch_related(
        Prefetch("story", queryset=_content_queryset(Story, "story", request.user)),
    )
    poem_likes = Like.objects.filter(user=request.user, poem__isnull=False).prefetch_related(
        Prefetch("poem", queryset=_content_queryset(Poem, "poem", request.user)),
    )
    payloads = [
        (like.created_at, _content_payload(like.story, "story")) for like in story_likes
    ] + [
        (like.created_at, _content_payload(like.poem, "poem")) for like in poem_likes
    ]
    return Response([item for _, item in sorted(payloads, key=lambda pair: pair[0], reverse=True)])


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="user.username", read_only=True)
    author_picture = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "author_name", "author_picture", "is_owner", "story", "chapter", "poem", "parent", "body", "rating", "like_count", "is_liked", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "author_name", "author_picture", "created_at", "updated_at"]

    def get_author_picture(self, obj):
        request = self.context.get("request")
        if not obj.user.profile_picture:
            return None
        return request.build_absolute_uri(obj.user.profile_picture.url) if request else obj.user.profile_picture.url

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.is_authenticated and obj.user_id == request.user.id)

    def get_like_count(self, obj):
        count = getattr(obj, "api_like_count", None)
        return count if count is not None else obj.likes_received.count()

    def get_is_liked(self, obj):
        return bool(getattr(obj, "api_is_liked", False))

    def validate(self, attrs):
        targets = [attrs.get("story"), attrs.get("chapter"), attrs.get("poem")]
        if sum(target is not None for target in targets) != 1:
            raise serializers.ValidationError("A comment must target exactly one story, chapter, or poem.")

        parent = attrs.get("parent")
        if parent is None and (attrs.get("story") or attrs.get("poem")) and not attrs.get("rating"):
            raise serializers.ValidationError({"rating": "A rating is required for a story or poem review."})

        if parent is not None:
            parent_targets = [parent.story, parent.chapter, parent.poem]
            if sum(target is not None for target in parent_targets) != 1:
                raise serializers.ValidationError("The parent comment must also belong to exactly one content target.")

            parent_target = next((target for target in (parent.story, parent.chapter, parent.poem) if target is not None), None)
            current_target = next((target for target in (attrs.get("story"), attrs.get("chapter"), attrs.get("poem")) if target is not None), None)
            if parent_target is None or current_target is None:
                raise serializers.ValidationError("A reply must target the same content as its parent comment.")
            if parent_target != current_target:
                raise serializers.ValidationError("A reply cannot belong to a different story, chapter, or poem than its parent comment.")

        return attrs


@api_view(["GET", "POST"])
def comments(request):
    story_id = request.query_params.get("story") if request.method == "GET" else request.data.get("story")
    chapter_id = request.query_params.get("chapter") if request.method == "GET" else request.data.get("chapter")
    poem_id = request.query_params.get("poem") if request.method == "GET" else request.data.get("poem")
    targets = [target for target in (story_id, chapter_id, poem_id) if target]
    if len(targets) != 1:
        return Response({"detail": "Exactly one story, chapter, or poem target is required."}, status=status.HTTP_400_BAD_REQUEST)
    if story_id:
        queryset = Comment.objects.filter(story_id=story_id, story__status="published", story__is_private=False)
    elif chapter_id:
        queryset = Comment.objects.filter(chapter_id=chapter_id, chapter__story__status="published", chapter__story__is_private=False)
    else:
        queryset = Comment.objects.filter(poem_id=poem_id, poem__status="published", poem__is_private=False)
    if request.method == "GET":
        sort = request.query_params.get("sort") or request.query_params.get("ordering") or "most_liked"
        if sort not in {"most_liked", "newest"}:
            return Response({"detail": "sort must be most_liked or newest."}, status=status.HTTP_400_BAD_REQUEST)
        viewer_likes = Like.objects.filter(comment_id=OuterRef("pk"))
        if request.user.is_authenticated:
            viewer_likes = viewer_likes.filter(user_id=request.user.id)
        else:
            viewer_likes = Like.objects.none()
        queryset = queryset.annotate(
            api_like_count=Count("likes_received", distinct=True),
            api_is_liked=Exists(viewer_likes),
        )
        order_by = ["-created_at"] if sort == "newest" else ["-api_like_count", "-created_at"]
        return Response(CommentSerializer(queryset.select_related("user").order_by(*order_by), many=True, context={"request": request}).data)
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
    if story_id and not Story.objects.filter(pk=story_id, status="published", is_private=False).exists():
        return Response({"detail": "Comments are unavailable for this story."}, status=status.HTTP_404_NOT_FOUND)
    if chapter_id and not Chapter.objects.filter(pk=chapter_id, story__status="published", story__is_private=False).exists():
        return Response({"detail": "Comments are unavailable for this chapter."}, status=status.HTTP_404_NOT_FOUND)
    if poem_id and not Poem.objects.filter(pk=poem_id, status="published", is_private=False).exists():
        return Response({"detail": "Comments are unavailable for this poem."}, status=status.HTTP_404_NOT_FOUND)
    serializer = CommentSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    comment = serializer.save(user=request.user)
    target = comment.chapter or comment.story or comment.poem
    if comment.parent_id:
        recipient = comment.parent.user
        notification_type = "reply"
        message = "replied to your comment"
    else:
        recipient = target.story.author if isinstance(target, Chapter) else target.author
        notification_type = "comment"
        message = "commented on your work"
    create_notification(
        recipient=recipient,
        actor=request.user,
        notification_type=notification_type,
        message=message,
        target=target,
    )
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
    comment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class LikeViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _story(self, pk):
        return get_object_or_404(Story, pk=pk)

    @action(detail=True, methods=['post'], url_path='like')
    def like_story(self, request, pk=None):
        return _set_like(request.user, "story", pk, True)

    @action(detail=True, methods=['post'], url_path='unlike')
    def unlike_story(self, request, pk=None):
        return _set_like(request.user, "story", pk, False)

    @action(detail=True, methods=['get'], url_path='is-liked')
    def is_liked(self, request, pk=None):
        story = self._story(pk)
        is_liked = Like.objects.filter(user=request.user, story=story).exists()
        count = Like.objects.filter(story=story).count()
        return Response({"is_liked": is_liked, "liked": is_liked, "like_count": count, "likes_count": count})


def _target_queryset(target_type):
    if target_type == "story":
        return Story.objects.filter(status=StoryStatus.PUBLISHED, is_private=False), "story"
    if target_type == "poem":
        return Poem.objects.filter(status=PoemStatus.PUBLISHED, is_private=False), "poem"
    if target_type == "chapter":
        return Chapter.objects.filter(story__status=StoryStatus.PUBLISHED, story__is_private=False), "chapter"
    if target_type in {"comment", "reply"}:
        visible_comments = Comment.objects.filter(
            Q(story__status=StoryStatus.PUBLISHED, story__is_private=False)
            | Q(poem__status=PoemStatus.PUBLISHED, poem__is_private=False)
            | Q(chapter__story__status=StoryStatus.PUBLISHED, chapter__story__is_private=False)
        )
        return visible_comments, "comment"
    return None, None


def _set_like(user, target_type, target_id, liked):
    queryset, target_field = _target_queryset(target_type)
    if queryset is None:
        return Response({"detail": "Unsupported like target."}, status=status.HTTP_400_BAD_REQUEST)
    with transaction.atomic():
        target = get_object_or_404(queryset.select_for_update(of=("self",)), pk=target_id)
        target_filter = {target_field: target}
        existing = Like.objects.filter(user=user, **target_filter)
        created = False
        if liked:
            _, created = existing.get_or_create(user=user, **target_filter)
        else:
            existing.delete()
        like_count = Like.objects.filter(**target_filter).count()
        is_liked = existing.exists()
    if created:
        _notify_like(user, target_type, target)
    return Response({"liked": is_liked, "is_liked": is_liked, "like_count": like_count, "likes_count": like_count})


def _notify_like(actor, target_type, target):
    if target_type == "story":
        recipient, notification_type, message = target.author, "story_like", "liked your story"
    elif target_type == "poem":
        recipient, notification_type, message = target.author, "poem_like", "liked your poem"
    elif target_type == "chapter":
        recipient, notification_type, message = target.story.author, "chapter_like", "liked your chapter"
    else:
        recipient, notification_type, message = target.user, "comment_like", "liked your comment"
    create_notification(
        recipient=recipient,
        actor=actor,
        notification_type=notification_type,
        message=message,
        target=target,
    )


def _notify_bookmark(actor, target_type, target):
    create_notification(
        recipient=target.author,
        actor=actor,
        notification_type=f"{target_type}_bookmark",
        message=f"bookmarked your {target_type}",
        target=target,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request, target_type, target_id):
    queryset, target_field = _target_queryset(target_type)
    if queryset is None:
        return Response({"detail": "Unsupported like target."}, status=status.HTTP_400_BAD_REQUEST)
    with transaction.atomic():
        target = get_object_or_404(queryset.select_for_update(of=("self",)), pk=target_id)
        target_filter = {target_field: target}
        existing = Like.objects.filter(user=request.user, **target_filter)
        created = False
        if existing.exists():
            existing.delete()
        else:
            _, created = Like.objects.get_or_create(user=request.user, **target_filter)
        liked = Like.objects.filter(user=request.user, **target_filter).exists()
        like_count = Like.objects.filter(**target_filter).count()
    if created:
        _notify_like(request.user, target_type, target)
    return Response({"liked": liked, "is_liked": liked, "like_count": like_count, "likes_count": like_count})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_bookmark(request, target_type, target_id):
    queryset, target_field = _target_queryset(target_type)
    if target_type not in {"story", "poem"} or queryset is None:
        return Response({"detail": "Only stories and poems can be bookmarked."}, status=status.HTTP_400_BAD_REQUEST)
    with transaction.atomic():
        target = get_object_or_404(queryset.select_for_update(of=("self",)), pk=target_id)
        target_filter = {target_field: target}
        existing = Bookmark.objects.filter(user=request.user, **target_filter)
        created = False
        if existing.exists():
            existing.delete()
        else:
            _, created = Bookmark.objects.get_or_create(user=request.user, **target_filter)
        bookmarked = Bookmark.objects.filter(user=request.user, **target_filter).exists()
    if created:
        _notify_bookmark(request.user, target_type, target)
    return Response({"is_bookmarked": bookmarked})


class BookmarkViewSet(viewsets.ViewSet):
    """
    ViewSet for managing bookmarks on stories.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='bookmark')
    def bookmark_story(self, request, pk=None):
        """Bookmark a story"""
        story = get_object_or_404(Story, pk=pk)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, story=story)

        if not created:
            return Response(
                {"detail": "You have already bookmarked this story"},
                status=status.HTTP_400_BAD_REQUEST
            )

        _notify_bookmark(request.user, "story", story)
        return Response(
            {
                "detail": "Story bookmarked successfully",
                "is_bookmarked": True
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], url_path='unbookmark')
    def unbookmark_story(self, request, pk=None):
        """Remove a story from bookmarks"""
        story = get_object_or_404(Story, pk=pk)
        bookmark = Bookmark.objects.filter(user=request.user, story=story)

        if not bookmark.exists():
            return Response(
                {"detail": "You have not bookmarked this story"},
                status=status.HTTP_400_BAD_REQUEST
            )

        bookmark.delete()

        return Response(
            {
                "detail": "Story unbookmarked successfully",
                "is_bookmarked": False
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'], url_path='is-bookmarked')
    def is_bookmarked(self, request, pk=None):
        """Check if the current user has bookmarked this story"""
        story = get_object_or_404(Story, pk=pk)
        is_bookmarked = Bookmark.objects.filter(user=request.user, story=story).exists()

        return Response(
            {
                "is_bookmarked": is_bookmarked
            },
            status=status.HTTP_200_OK
        )
