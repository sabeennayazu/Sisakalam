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


def _content_payload(content, content_type):
    return {
        "content_id": content.id,
        "content_type": content_type,
        "title": content.title,
        "author_name": content.author.username if content.author else None,
        "author_id": content.author_id,
        "chapter_slug": content.chapters.order_by("order").values_list("slug", flat=True).first() if content_type == "story" else None,
        "genre_name": content.genre.name if content.genre else None,
        "image": content.image.url if content.image else None,
        "views": content.views,
        "likes": content.likes,
        "comments_count": content.comments_count,
        "is_mature": content.is_mature,
        "is_private": getattr(content, "is_private", False),
    }


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def bookmarked_content(request):
    bookmarks = Bookmark.objects.filter(user=request.user).select_related(
        "story__author", "story__genre", "poem__author", "poem__genre"
    ).order_by("-created_at")
    return Response([
        _content_payload(bookmark.story, "story") if bookmark.story
        else _content_payload(bookmark.poem, "poem")
        for bookmark in bookmarks
    ])


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def liked_content(request):
    likes = Like.objects.filter(user=request.user).select_related(
        "story__author", "story__genre", "poem__author", "poem__genre"
    ).order_by("-created_at")
    return Response([
        _content_payload(like.story, "story") if like.story
        else _content_payload(like.poem, "poem")
        for like in likes
    ])


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="user.username", read_only=True)
    is_owner = serializers.SerializerMethodField()
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False, allow_null=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "author_name", "is_owner", "story", "chapter", "poem", "parent", "body", "rating", "like_count", "created_at", "updated_at"]
        read_only_fields = ["id", "user", "author_name", "created_at", "updated_at"]

    def get_is_owner(self, obj):
        request = self.context.get("request")
        return bool(request and request.user.is_authenticated and obj.user_id == request.user.id)

    def validate(self, attrs):
        targets = [attrs.get("story"), attrs.get("chapter"), attrs.get("poem")]
        if sum(target is not None for target in targets) != 1:
            raise serializers.ValidationError("A comment must target exactly one story, chapter, or poem.")
        if (attrs.get("story") or attrs.get("poem")) and not attrs.get("rating"):
            raise serializers.ValidationError({"rating": "A rating is required for a story or poem review."})
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
        sort = request.query_params.get("sort", "most_liked")
        if sort not in {"most_liked", "newest"}:
            return Response({"detail": "sort must be most_liked or newest."}, status=status.HTTP_400_BAD_REQUEST)
        order_by = ["-created_at"] if sort == "newest" else ["-like_count", "-created_at"]
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
    serializer.save(user=request.user)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    comment = get_object_or_404(Comment, pk=comment_id, user=request.user)
    comment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class LikeViewSet(viewsets.ViewSet):
    """
    ViewSet for managing likes on stories.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='like')
    def like_story(self, request, pk=None):
        """Like a story"""
        story = get_object_or_404(Story, pk=pk)
        like, created = Like.objects.get_or_create(user=request.user, story=story)

        if not created:
            return Response(
                {"detail": "You have already liked this story"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update story likes count
        story.likes += 1
        story.save()

        return Response(
            {
                "detail": "Story liked successfully",
                "is_liked": True,
                "likes_count": story.likes
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'], url_path='unlike')
    def unlike_story(self, request, pk=None):
        """Unlike a story"""
        story = get_object_or_404(Story, pk=pk)
        like = Like.objects.filter(user=request.user, story=story)

        if not like.exists():
            return Response(
                {"detail": "You have not liked this story"},
                status=status.HTTP_400_BAD_REQUEST
            )

        like.delete()

        # Update story likes count
        story.likes -= 1
        story.save()

        return Response(
            {
                "detail": "Story unliked successfully",
                "is_liked": False,
                "likes_count": story.likes
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'], url_path='is-liked')
    def is_liked(self, request, pk=None):
        """Check if the current user has liked this story"""
        story = get_object_or_404(Story, pk=pk)
        is_liked = Like.objects.filter(user=request.user, story=story).exists()

        return Response(
            {
                "is_liked": is_liked,
                "likes_count": story.likes
            },
            status=status.HTTP_200_OK
        )


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
