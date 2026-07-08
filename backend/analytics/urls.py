from django.urls import path
from .views import (
    DashboardStatsView,
    PoemViewEventView,
    PopularGenresView,
    PopularPoemsView,
    PopularStoriesView,
    ReadingDurationView,
    RecommendationClickView,
    StoryViewEventView,
)

urlpatterns = [
    path("stories/<int:pk>/views/", StoryViewEventView.as_view(), name="story-view-event"),
    path("poems/<int:pk>/views/", PoemViewEventView.as_view(), name="poem-view-event"),
    path("reading-duration/", ReadingDurationView.as_view(), name="reading-duration"),
    path("recommendation-clicks/", RecommendationClickView.as_view(), name="recommendation-click"),
    path("stats/", DashboardStatsView.as_view(), name="dashboard-stats"),
    path("popular-genres/", PopularGenresView.as_view(), name="popular-genres"),
    path("popular-stories/", PopularStoriesView.as_view(), name="popular-stories"),
    path("popular-poems/", PopularPoemsView.as_view(), name="popular-poems"),
]
