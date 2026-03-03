from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from stories.models import Story
from .models import Like, Bookmark
from .serializers import LikeSerializer, BookmarkSerializer


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
