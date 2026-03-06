from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from .models import Genre
from .serializers import GenreSerializer


class GenreListView(ListAPIView):
    """
    GET /api/stories/genres/
    Optional query param: ?type=story or ?type=poem
    Returns genres filtered by type, or all genres if no type is given.
    """
    serializer_class = GenreSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Genre.objects.all().order_by("name")
        genre_type = self.request.query_params.get("type")
        if genre_type in ("story", "poem"):
            queryset = queryset.filter(type=genre_type)
        return queryset
