from django.conf import settings
from django.db import models
from poems.models import Poem
from stories.models import Story


class Collection(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="collections"
    )
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to="collections/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class CollectionItem(models.Model):
    collection = models.ForeignKey(
        Collection,
        on_delete=models.CASCADE,
        related_name="items"
    )
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name="collection_items",
        null=True,
        blank=True,
    )
    poem = models.ForeignKey(
        Poem,
        on_delete=models.CASCADE,
        related_name="collection_items",
        null=True,
        blank=True,
    )
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["added_at"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(story__isnull=False) | models.Q(poem__isnull=False),
                name="library_collectionitem_has_content"
            )
        ]

    def __str__(self):
        if self.story:
            return f"{self.story.title} in {self.collection.name}"
        return f"{self.poem.title} in {self.collection.name}"


class ReadingHistory(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reading_history"
    )
    story = models.ForeignKey(
        Story,
        on_delete=models.CASCADE,
        related_name="reading_history",
        null=True,
        blank=True,
    )
    poem = models.ForeignKey(
        Poem,
        on_delete=models.CASCADE,
        related_name="reading_history",
        null=True,
        blank=True,
    )
    last_read_at = models.DateTimeField(auto_now=True)
    progress_percent = models.PositiveIntegerField(default=0)
    completed = models.BooleanField(default=False)

    class Meta:
        ordering = ["-last_read_at"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(story__isnull=False) | models.Q(poem__isnull=False),
                name="library_readinghistory_has_content"
            )
        ]

    def __str__(self):
        if self.story:
            return f"{self.user.email} read {self.story.title}"
        return f"{self.user.email} read {self.poem.title}"
