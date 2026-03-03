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