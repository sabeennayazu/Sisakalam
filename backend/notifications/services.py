from django.contrib.contenttypes.models import ContentType
from django.db.models import Q

from accounts.models import Follow
from .models import Notification, NotificationPreference


PREFERENCE_BY_TYPE = {
    "follow": "new_followers",
    "story_like": "story_likes",
    "poem_like": "poem_likes",
    "story_bookmark": "story_bookmarks",
    "poem_bookmark": "poem_bookmarks",
    "chapter_like": "story_likes",
    "comment_like": "comments",
    "comment": "comments",
    "reply": "replies",
    "new_story": "followed_updates",
    "new_poem": "followed_updates",
    "new_chapter": "followed_updates",
}


def create_notification(*, recipient, actor, notification_type, message, target=None):
    if recipient is None or (actor is not None and recipient.pk == actor.pk):
        return None

    preference_name = PREFERENCE_BY_TYPE.get(notification_type)
    if preference_name:
        preference = getattr(recipient, "notification_preferences", None)
        if preference is not None and not getattr(preference, preference_name, True):
            return None

    target_content_type = ContentType.objects.get_for_model(target) if target is not None else None
    return Notification.objects.create(
        recipient=recipient,
        actor=actor,
        notification_type=notification_type,
        message=message,
        target_content_type=target_content_type,
        target_object_id=target.pk if target is not None else None,
    )


def notify_followers(*, author, notification_type, message, target):
    follower_ids = Follow.objects.filter(following=author).exclude(
        follower=author,
    ).filter(
        Q(follower__notification_preferences__isnull=True)
        | Q(follower__notification_preferences__followed_updates=True)
    ).values_list("follower_id", flat=True)
    recipients = list(author.__class__.objects.filter(pk__in=follower_ids))
    content_type = ContentType.objects.get_for_model(target)
    return Notification.objects.bulk_create([
        Notification(
            recipient=recipient,
            actor=author,
            notification_type=notification_type,
            message=message,
            target_content_type=content_type,
            target_object_id=target.pk,
        )
        for recipient in recipients
    ])