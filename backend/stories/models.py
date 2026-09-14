from django.db import models
from django.conf import settings
from django.utils.text import slugify


class Tags(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)

    def __str__(self):
        return self.name


class GenreType(models.TextChoices):
    STORY = "story", "Story"
    POEM = "poem", "Poem"


class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)
    type = models.CharField(
        max_length=10,
        choices=GenreType.choices,
        default=GenreType.STORY,
        db_index=True,
    )

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"


class StoryStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"


class Story(models.Model):

    title = models.CharField(max_length=200)

   

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
        Tags,
        related_name="stories",
        blank=True
    )

    image = models.ImageField(
        upload_to="story_images/",
        blank=True,
        null=True
    )

    is_mature = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)

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
    chapter_count = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)
    likes = models.PositiveIntegerField(default=0)
    comments_count = models.PositiveIntegerField(default=0)
    favorites_count = models.PositiveIntegerField(default=0)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def publish(self):
        """Publish the story"""
        from django.utils import timezone
        self.status = StoryStatus.PUBLISHED
        self.published_at = timezone.now()
        self.save()
        if not self.chapters.exists():
            Chapter.objects.create(
                story=self,
                title=self.title,
                chapter_number=1,
                order=1,
                content="",
            )

    def __str__(self):
        return self.title

class Chapter(models.Model):
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name="chapters"
    )
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, default="")
    chapter_number = models.PositiveIntegerField()
    content = models.TextField()
    order = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("story", "order")
        ordering = ["order"]
        constraints = [
            models.UniqueConstraint(fields=["story", "slug"], name="unique_story_chapter_slug"),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or f"chapter-{self.chapter_number}"
            candidate = base_slug
            suffix = 2
            while Chapter.objects.filter(story=self.story, slug=candidate).exclude(pk=self.pk).exists():
                candidate = f"{base_slug}-{suffix}"
                suffix += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.story.title} - Chapter {self.order}: {self.title}"