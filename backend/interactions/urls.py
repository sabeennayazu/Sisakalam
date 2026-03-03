from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LikeViewSet, BookmarkViewSet

router = DefaultRouter()

urlpatterns = [
    path('stories/<int:pk>/like/', LikeViewSet.as_view({'post': 'like_story'}), name='like-story'),
    path('stories/<int:pk>/unlike/', LikeViewSet.as_view({'post': 'unlike_story'}), name='unlike-story'),
    path('stories/<int:pk>/is-liked/', LikeViewSet.as_view({'get': 'is_liked'}), name='is-liked'),
    path('stories/<int:pk>/bookmark/', BookmarkViewSet.as_view({'post': 'bookmark_story'}), name='bookmark-story'),
    path('stories/<int:pk>/unbookmark/', BookmarkViewSet.as_view({'post': 'unbookmark_story'}), name='unbookmark-story'),
    path('stories/<int:pk>/is-bookmarked/', BookmarkViewSet.as_view({'get': 'is_bookmarked'}), name='is-bookmarked'),
]
