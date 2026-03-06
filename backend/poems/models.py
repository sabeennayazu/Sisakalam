from django.db import models
from django.conf import settings
from stories.models import Genre, Tags


class PoemStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"


class Poem(models.Model):

    title = models.CharField(max_length=200)

    content = models.TextField()

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="poems"
    )

    genre = models.ForeignKey(
        Genre,
        on_delete=models.CASCADE,
        related_name="poems"
    )

    tags = models.ManyToManyField(
        Tags,
        related_name="poems",
        blank=True
    )

    image = models.ImageField(
        upload_to="poem_images/",
        blank=True,
        null=True
    )

    is_mature = models.BooleanField(default=False)

    status = models.CharField(
        max_length=10,
        choices=PoemStatus.choices,
        default=PoemStatus.DRAFT,
        db_index=True
    )

    published_at = models.DateTimeField(
        blank=True,
        null=True
    )

    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def publish(self):
        from django.utils import timezone
        self.status = PoemStatus.PUBLISHED
        self.published_at = timezone.now()
        self.save()

    def __str__(self):
        return self.title