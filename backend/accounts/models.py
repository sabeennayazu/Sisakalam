from django.conf import settings
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    # ----------------------
    # Authentication
    # ----------------------
    email = models.EmailField(unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    # ----------------------
    # Profile Information
    # ----------------------
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )
    banner_image = models.ImageField(
        upload_to="profile_banners/",
        blank=True,
        null=True
    )

    website = models.URLField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    # ----------------------
    # Social Stats (Cached)
    # ----------------------
    followers_count = models.PositiveIntegerField(default=0)
    following_count = models.PositiveIntegerField(default=0)

    total_poems = models.PositiveIntegerField(default=0)
    total_stories = models.PositiveIntegerField(default=0)

    total_views = models.PositiveIntegerField(default=0)
    total_likes = models.PositiveIntegerField(default=0)

    # ----------------------
    # Account Flags
    # ----------------------
    is_verified_writer = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)

    # ----------------------
    # Timestamps
    # ----------------------
    joined_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.email


class PrivacyPermission(models.TextChoices):
    EVERYONE = "everyone", "Everyone"
    REGISTERED = "registered", "Registered users"
    FOLLOWERS = "followers", "Followers only"
    NO_ONE = "noone", "No one"


class UserPrivacyPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="privacy_preferences"
    )
    show_in_search = models.BooleanField(default=True)
    hide_from_search_engines = models.BooleanField(default=False)
    hide_followers_list = models.BooleanField(default=False)
    allow_story_comments = models.CharField(
        max_length=20,
        choices=PrivacyPermission.choices,
        default=PrivacyPermission.EVERYONE,
    )
    allow_poem_comments = models.CharField(
        max_length=20,
        choices=PrivacyPermission.choices,
        default=PrivacyPermission.EVERYONE,
    )
    allow_messages = models.CharField(
        max_length=20,
        choices=PrivacyPermission.choices,
        default=PrivacyPermission.REGISTERED,
    )
    allow_tagging = models.CharField(
        max_length=20,
        choices=PrivacyPermission.choices,
        default=PrivacyPermission.FOLLOWERS,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Privacy settings for {self.user.email}"


class Follow(models.Model):
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="following_set"
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="followers_set"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("follower", "following")

    def __str__(self):
        return f"{self.follower.email} follows {self.following.email}"