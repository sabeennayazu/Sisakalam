from django.db import models
from django.conf import settings


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)

    def __str__(self):
        return self.name


class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class StoryStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"


class Story(models.Model):

    title = models.CharField(max_length=200)

    content = models.TextField()

    synopsis = models.TextField(max_length=500)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="stories"
    )

    genre = models.ForeignKey(
        Genre,
        on_delete=models.CASCADE,
        related_name="stories"
    )

    tags = models.ManyToManyField(
        Tag,
        related_name="stories",
        blank=True
    )

    image = models.ImageField(
        upload_to="story_images/",
        blank=True,
        null=True
    )

    is_mature = models.BooleanField(default=False)

    status = models.CharField(
        max_length=10,
        choices=StoryStatus.choices,
        default=StoryStatus.DRAFT,
        db_index=True
    )

    published_at = models.DateTimeField(
        null=True,
        blank=True
    )

    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def publish(self):
        """Publish the story"""
        from django.utils import timezone
        self.status = StoryStatus.PUBLISHED
        self.published_at = timezone.now()
        self.save()

    def __str__(self):
        return self.title