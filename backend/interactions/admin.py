from django.contrib import admin
from .models import Like, Bookmark

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ['user', 'story', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'story__title']

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ['user', 'story', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__email', 'story__title']
