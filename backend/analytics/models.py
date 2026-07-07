from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from poems.models import Poem
from stories.models import Genre, Story


class StoryImpression(models.Model):
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name="impressions"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="story_impressions"
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Impression for {self.story.title}"


class RecommendationClick(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="recommendation_clicks"
    )
    recommendation_source = models.CharField(max_length=50, default="home")
    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey("target_content_type", "target_object_id")
    clicked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-clicked_at"]

    def __str__(self):
        return f"Recommendation click from {self.recommendation_source}"


class ReadingDuration(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reading_durations"
    )
    target_content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    target_object_id = models.PositiveIntegerField(null=True, blank=True)
    target = GenericForeignKey("target_content_type", "target_object_id")
    duration_seconds = models.PositiveIntegerField(default=0)
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-ended_at"]

    def __str__(self):
        return f"Reading duration {self.duration_seconds}s"


class GenrePopularity(models.Model):
    genre = models.ForeignKey(
        Genre,
        on_delete=models.CASCADE,
        related_name="popularity_stats"
    )
    date = models.DateField(db_index=True)
    story_views = models.PositiveIntegerField(default=0)
    poem_views = models.PositiveIntegerField(default=0)
    total_views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    reads = models.PositiveIntegerField(default=0)
    score = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("genre", "date")
        ordering = ["-date"]

    def __str__(self):
        return f"{self.genre.name} popularity on {self.date}"


class DailyActiveUser(models.Model):
    date = models.DateField(unique=True)
    active_user_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.active_user_count} active users on {self.date}"
