from rest_framework import serializers
from .models import Like, Bookmark


class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['id', 'user', 'story', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookmark
        fields = ['id', 'user', 'story', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
