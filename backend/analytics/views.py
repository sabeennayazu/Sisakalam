from django.contrib.contenttypes.models import ContentType
from django.db.models import Sum
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from poems.models import Poem
from stories.models import Genre, Story
from .models import DailyActiveUser, GenrePopularity, ReadingDuration, RecommendationClick, StoryImpression


class StoryViewEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        StoryImpression.objects.create(story=story, user=request.user if request.user.is_authenticated else None, ip_address=request.META.get("REMOTE_ADDR"))
        story.views = story.views + 1
        story.save(update_fields=["views"])
        return Response({"detail": "Story view recorded."})


class PoemViewEventView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk):
        poem = get_object_or_404(Poem, pk=pk)
        poem.views = poem.views + 1
        poem.save(update_fields=["views"])
        return Response({"detail": "Poem view recorded."})


class ReadingDurationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        target_type = request.data.get("target_type")
        target_id = request.data.get("target_id")
        duration_seconds = request.data.get("duration_seconds", 0)
        if not target_type or not target_id or not duration_seconds:
            return Response({"detail": "Invalid payload."}, status=status.HTTP_400_BAD_REQUEST)
        model = Story if target_type == "story" else Poem if target_type == "poem" else None
        if not model:
            return Response({"detail": "Unsupported target type."}, status=status.HTTP_400_BAD_REQUEST)
        target = get_object_or_404(model, pk=target_id)
        ReadingDuration.objects.create(
            user=request.user if request.user.is_authenticated else None,
            target_content_type=ContentType.objects.get_for_model(model),
            target_object_id=target.id,
            duration_seconds=duration_seconds,
        )
        return Response({"detail": "Reading duration recorded."})


class RecommendationClickView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        source = request.data.get("source", "home")
        target_type = request.data.get("target_type")
        target_id = request.data.get("target_id")
        if not target_type or not target_id:
            return Response({"detail": "Invalid payload."}, status=status.HTTP_400_BAD_REQUEST)
        model = Story if target_type == "story" else Poem if target_type == "poem" else None
        if not model:
            return Response({"detail": "Unsupported target type."}, status=status.HTTP_400_BAD_REQUEST)
        target = get_object_or_404(model, pk=target_id)
        RecommendationClick.objects.create(
            user=request.user if request.user.is_authenticated else None,
            recommendation_source=source,
            target_content_type=ContentType.objects.get_for_model(model),
            target_object_id=target.id,
        )
        return Response({"detail": "Recommendation click recorded."})


class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "stories_count": Story.objects.filter(author=request.user).count(),
            "poems_count": Poem.objects.filter(author=request.user).count(),
            "total_views": Story.objects.filter(author=request.user).aggregate(total=Sum("views"))["total"] or 0,
        })


class PopularGenresView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stats = GenrePopularity.objects.select_related("genre").order_by("-total_views")[:10]
        return Response([
            {"id": item.genre_id, "name": item.genre.name, "total_views": item.total_views}
            for item in stats
        ])


class PopularStoriesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stories = Story.objects.filter(status="published").order_by("-views", "-likes")[:10]
        return Response([
            {"id": story.id, "title": story.title, "views": story.views, "likes": story.likes}
            for story in stories
        ])


class PopularPoemsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        poems = Poem.objects.filter(status="published").order_by("-views", "-likes")[:10]
        return Response([
            {"id": poem.id, "title": poem.title, "views": poem.views, "likes": poem.likes}
            for poem in poems
        ])
