from django.db.models import BooleanField, Count, Exists, OuterRef, Value

from .models import Bookmark, Like


def annotate_content_interactions(queryset, target_field, user):
    like_filter = {f"{target_field}_id": OuterRef("pk")}
    bookmark_filter = {f"{target_field}_id": OuterRef("pk")}
    liked_by_user = Like.objects.filter(**like_filter)
    bookmarked_by_user = Bookmark.objects.filter(**bookmark_filter)

    if user and user.is_authenticated:
        liked_by_user = liked_by_user.filter(user_id=user.pk)
        bookmarked_by_user = bookmarked_by_user.filter(user_id=user.pk)
        is_liked = Exists(liked_by_user)
        is_bookmarked = Exists(bookmarked_by_user)
    else:
        is_liked = Value(False, output_field=BooleanField())
        is_bookmarked = Value(False, output_field=BooleanField())

    return queryset.annotate(
        api_likes_count=Count("likes_received", distinct=True),
        api_comments_count=Count("comments", distinct=True),
        api_is_liked=is_liked,
        api_is_bookmarked=is_bookmarked,
    )