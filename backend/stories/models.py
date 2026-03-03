from django.db import models
from django.conf import settings


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Story(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    synopsis = models.TextField()

    genre = models.CharField(max_length=100)

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
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

    nsfw = models.BooleanField(default=False)

    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title