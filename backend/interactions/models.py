from django.db import models
from django.contrib.auth import get_user_model
from stories.models import Story
from poems.models import Poem

User = get_user_model()


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='likes')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='liked_by', null=True, blank=True)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='liked_by', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'story', 'poem')

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
        unique_together = ('user', 'story', 'poem')

    def __str__(self):
        if self.story:
            return f"{self.user.email} bookmarked {self.story.title}"
        return f"{self.user.email} bookmarked a poem"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    poem = models.ForeignKey(Poem, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies', null=True, blank=True)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        if self.story:
            return f"{self.user.email} commented on {self.story.title}"
        return f"{self.user.email} commented on a poem"