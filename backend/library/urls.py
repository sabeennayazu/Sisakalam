from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import CollectionItemViewSet, CollectionViewSet, ReadingHistoryViewSet

router = DefaultRouter()
router.register(r"collections", CollectionViewSet, basename="collection")

urlpatterns = [
    path("history/", ReadingHistoryViewSet.as_view({"get": "list", "post": "update_progress"}), name="reading-history"),
    path("history/continue-reading/", ReadingHistoryViewSet.as_view({"get": "continue_reading"}), name="continue-reading"),
    path("collections/<int:collection_id>/items/", CollectionItemViewSet.as_view({"post": "create"}), name="collection-items"),
    path("collections/items/<int:pk>/", CollectionItemViewSet.as_view({"delete": "destroy"}), name="collection-item-detail"),
    path("", include(router.urls)),
]
