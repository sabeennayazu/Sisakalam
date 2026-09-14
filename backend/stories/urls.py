from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AuthorStoryListView, GenreListView, StoryChapterBySlugAPIView, StoryChapterDetailAPIView, StoryChapterListCreateAPIView, StoryViewSet

router = DefaultRouter()
router.register(r"", StoryViewSet, basename="story")

urlpatterns = [
    path("genres/", GenreListView.as_view(), name="genre-list"),
    path("authors/<int:author_id>/stories/", AuthorStoryListView.as_view(), name="author-story-list"),
    path("<int:story_id>/chapters/", StoryChapterListCreateAPIView.as_view(), name="story-chapters"),
    path("<int:story_id>/chapters/by-slug/<slug:slug>/", StoryChapterBySlugAPIView.as_view(), name="story-chapter-by-slug"),
    path("<int:story_id>/chapters/<int:pk>/", StoryChapterDetailAPIView.as_view(), name="story-chapter-detail"),
    path("", include(router.urls)),
]
