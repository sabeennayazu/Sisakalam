from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification, NotificationPreference


class NotificationPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = "page_size"
    max_page_size = 100


def serialize_notification(notification, request):
    actor = notification.actor
    target = notification.target
    target_type = notification.target_content_type.model if notification.target_content_type_id else None
    target_title = None
    target_url = None
    target_image = None

    if target is not None:
        if target_type in {"story", "poem"}:
            target_title = target.title
            target_url = f"/{'stories' if target_type == 'story' else 'poems'}/{target.pk}"
            if getattr(target, "image", None):
                target_image = request.build_absolute_uri(target.image.url)
        elif target_type == "chapter":
            story = target.story
            target_title = f"{story.title} · Chapter {target.chapter_number}: {target.title}"
            target_url = f"/stories/{story.pk}/{target.slug}"
            if story.image:
                target_image = request.build_absolute_uri(story.image.url)
        elif target_type == "comment":
            content = target.chapter or target.story or target.poem
            if content is not None and content._meta.model_name == "chapter":
                story = content.story
                target_title = f"{story.title} · Chapter {content.chapter_number}: {content.title}"
                target_url = f"/stories/{story.pk}/{content.slug}"
                if story.image:
                    target_image = request.build_absolute_uri(story.image.url)
            elif content is not None:
                content_type = content._meta.model_name
                target_title = content.title
                target_url = f"/{'stories' if content_type == 'story' else 'poems'}/{content.pk}"
                if getattr(content, "image", None):
                    target_image = request.build_absolute_uri(content.image.url)
        elif target_type == "user":
            target_title = target.username
            target_url = f"/profile/{target.username}"

    avatar = None
    if actor and actor.profile_picture:
        avatar = request.build_absolute_uri(actor.profile_picture.url)

    return {
        "id": notification.pk,
        "type": notification.notification_type,
        "message": notification.message,
        "is_read": notification.is_read,
        "created_at": notification.created_at,
        "actor": {
            "id": actor.pk,
            "username": actor.username,
            "avatar": avatar,
        } if actor else None,
        "target_type": target_type,
        "target_id": notification.target_object_id,
        "target_title": target_title,
        "target_url": target_url,
        "target_image": target_image,
    }


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).select_related(
            "actor", "target_content_type",
        )
        if request.query_params.get("unread") in {"1", "true"}:
            notifications = notifications.filter(is_read=False)
        paginator = NotificationPagination()
        page = paginator.paginate_queryset(notifications, request, view=self)
        return paginator.get_paginated_response([
            serialize_notification(notification, request) for notification in page
        ])


class NotificationUnreadCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = Notification.objects.filter(recipient=request.user, is_read=False).count()
        return Response({"unread_count": count})


class NotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.is_read = True
        notification.save(update_fields=["is_read"])
        return Response({"detail": "Marked as read."})


class NotificationMarkAllReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user, is_read=False).update(is_read=True)
        return Response({"detail": "All notifications marked as read."})


class NotificationDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
        notification.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class NotificationClearView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(recipient=request.user).delete()
        return Response({"detail": "Notifications cleared."})


class NotificationPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preference, _ = NotificationPreference.objects.get_or_create(user=request.user)
        return Response({
            "new_followers": preference.new_followers,
            "story_likes": preference.story_likes,
            "poem_likes": preference.poem_likes,
            "story_bookmarks": preference.story_bookmarks,
            "poem_bookmarks": preference.poem_bookmarks,
            "comments": preference.comments,
            "replies": preference.replies,
            "followed_updates": preference.followed_updates,
            "email_digest_frequency": preference.email_digest_frequency,
        })

    def patch(self, request):
        preference, _ = NotificationPreference.objects.get_or_create(user=request.user)
        for field in ["new_followers", "story_likes", "poem_likes", "story_bookmarks", "poem_bookmarks", "comments", "replies", "followed_updates", "email_digest_frequency"]:
            if field in request.data and field != "email_digest_frequency" and not isinstance(request.data[field], bool):
                return Response({field: "Expected a boolean value."}, status=status.HTTP_400_BAD_REQUEST)
            if field == "email_digest_frequency" and field in request.data and request.data[field] not in {"instant", "daily", "weekly", "disabled"}:
                return Response({field: "Invalid email digest frequency."}, status=status.HTTP_400_BAD_REQUEST)
            if field in request.data:
                setattr(preference, field, request.data[field])
        preference.save()
        return Response({"detail": "Preferences updated."})


class RecentNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(recipient=request.user).select_related(
            "actor", "target_content_type",
        )[:5]
        return Response([serialize_notification(notification, request) for notification in notifications])
