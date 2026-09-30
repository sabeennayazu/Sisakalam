from django.db import models
from django.db.models import Q
from django.contrib.auth import get_user_model
from stories.models import Chapter, Story
from poems.models import Poem

User = get_user_model()


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='likes_received', null=True, blank=True)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='likes_received', null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='likes_received', null=True, blank=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name='likes_received', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    Q(story__isnull=False, poem__isnull=True, chapter__isnull=True, comment__isnull=True)
                    | Q(story__isnull=True, poem__isnull=False, chapter__isnull=True, comment__isnull=True)
                    | Q(story__isnull=True, poem__isnull=True, chapter__isnull=False, comment__isnull=True)
                    | Q(story__isnull=True, poem__isnull=True, chapter__isnull=True, comment__isnull=False)
                ),
                name='like_exactly_one_target',
            ),
            models.UniqueConstraint(fields=['user', 'story'], condition=Q(story__isnull=False), name='unique_user_story_like'),
            models.UniqueConstraint(fields=['user', 'poem'], condition=Q(poem__isnull=False), name='unique_user_poem_like'),
            models.UniqueConstraint(fields=['user', 'chapter'], condition=Q(chapter__isnull=False), name='unique_user_chapter_like'),
            models.UniqueConstraint(fields=['user', 'comment'], condition=Q(comment__isnull=False), name='unique_user_comment_like'),
        ]

    def __str__(self):
        if self.story:
            return f"{self.user.email} likes {self.story.title}"
        return f"{self.user.email} likes a poem"


class Bookmark(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookmarks')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='bookmarked_by', null=True, blank=True)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='bookmarked_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(story__isnull=False, poem__isnull=True) | Q(story__isnull=True, poem__isnull=False),
                name='bookmark_exactly_one_target',
            ),
            models.UniqueConstraint(fields=['user', 'story'], condition=Q(story__isnull=False), name='unique_user_story_bookmark'),
            models.UniqueConstraint(fields=['user', 'poem'], condition=Q(poem__isnull=False), name='unique_user_poem_bookmark'),
        ]

    def __str__(self):
        if self.story:
            return f"{self.user.email} bookmarked {self.story.title}"
        return f"{self.user.email} bookmarked a poem"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)
    body = models.TextField()
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    like_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['story', 'created_at'], name='interactions_story_cmt_idx'),
            models.Index(fields=['poem', 'created_at'], name='interactions_poem_cmt_idx'),
            models.Index(fields=['chapter', 'created_at'], name='interactions_chapter_cmt_idx'),
        ]
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(story__isnull=False, chapter__isnull=True, poem__isnull=True)
                    | models.Q(story__isnull=True, chapter__isnull=False, poem__isnull=True)
                    | models.Q(story__isnull=True, chapter__isnull=True, poem__isnull=False)
                ),
                name='comment_exactly_one_target',
            ),
        ]

    def __str__(self):
        if self.story:
            return f"{self.user.email} commented on {self.story.title}"
        return f"{self.user.email} commented on a poem"