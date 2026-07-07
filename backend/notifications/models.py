from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.utils import timezone


class NotificationPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notification_preferences"
    )
    new_followers = models.BooleanField(default=True)
    story_likes = models.BooleanField(default=True)
    poem_likes = models.BooleanField(default=True)
    comments = models.BooleanField(default=True)
    replies = models.BooleanField(default=True)
    email_digest_frequency = models.CharField(
        max_length=20,
        choices=[
            ("instant", "Instant"),
            ("daily", "Daily summary"),
            ("weekly", "Weekly summary"),
            ("disabled", "Disabled"),
        ],
        default="daily",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Notification preferences for {self.user.email}"


class Notification(models.Model):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="triggered_notifications"
    )
    notification_type = models.CharField(max_length=50)
    message = models.TextField(blank=True)
    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey("target_content_type", "target_object_id")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.notification_type} for {self.recipient.email}"