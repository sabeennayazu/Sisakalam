from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import PoemViewSet

router = DefaultRouter()
router.register(r"", PoemViewSet, basename="poem")

urlpatterns = [
    path("", include(router.urls)),
]
