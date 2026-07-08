from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from poems.models import Poem
from stories.models import Story
from .models import Collection, CollectionItem, ReadingHistory


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collection
        fields = ["id", "name", "description", "cover_image", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class CollectionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollectionItem
        fields = ["id", "collection", "story", "poem", "added_at"]
        read_only_fields = ["id", "collection", "added_at"]


class ReadingHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingHistory
        fields = ["id", "story", "poem", "last_read_at", "progress_percent", "completed"]
        read_only_fields = ["id", "last_read_at"]


class CollectionViewSet(viewsets.ModelViewSet):
    serializer_class = CollectionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Collection.objects.filter(owner=self.request.user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ReadingHistoryViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        entries = ReadingHistory.objects.filter(user=request.user).select_related("story", "poem")
        serializer = ReadingHistorySerializer(entries, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="continue-reading")
    def continue_reading(self, request):
        entry = ReadingHistory.objects.filter(user=request.user).select_related("story", "poem").order_by("-last_read_at").first()
        if not entry:
            return Response({"detail": "No reading history yet."}, status=status.HTTP_404_NOT_FOUND)
        serializer = ReadingHistorySerializer(entry)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="update")
    def update_progress(self, request):
        story_id = request.data.get("story")
        poem_id = request.data.get("poem")
        progress_percent = request.data.get("progress_percent", 0)
        completed = request.data.get("completed", False)

        if not story_id and not poem_id:
            return Response({"detail": "A story or poem must be provided."}, status=status.HTTP_400_BAD_REQUEST)

        history_entry, created = ReadingHistory.objects.get_or_create(
            user=request.user,
            story_id=story_id or None,
            poem_id=poem_id or None,
        )
        history_entry.progress_percent = progress_percent
        history_entry.completed = completed
        history_entry.save(update_fields=["progress_percent", "completed", "last_read_at"])
        return Response(ReadingHistorySerializer(history_entry).data)


class CollectionItemViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, collection_id=None):
        collection = get_object_or_404(Collection, pk=collection_id, owner=request.user)
        story_id = request.data.get("story")
        poem_id = request.data.get("poem")
        if not story_id and not poem_id:
            return Response({"detail": "A story or poem must be provided."}, status=status.HTTP_400_BAD_REQUEST)

        item = CollectionItem.objects.create(
            collection=collection,
            story_id=story_id or None,
            poem_id=poem_id or None,
        )
        return Response(CollectionItemSerializer(item).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, pk=None):
        item = get_object_or_404(CollectionItem, pk=pk, collection__owner=request.user)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
