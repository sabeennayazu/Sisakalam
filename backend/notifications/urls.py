from django.urls import path
from .views import (
    NotificationDeleteView,
    NotificationListView,
    NotificationMarkAllReadView,
    NotificationMarkReadView,
    NotificationPreferenceView,
    NotificationUnreadCountView,
    RecentNotificationsView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("unread-count/", NotificationUnreadCountView.as_view(), name="notification-unread-count"),
    path("recent/", RecentNotificationsView.as_view(), name="recent-notifications"),
    path("preferences/", NotificationPreferenceView.as_view(), name="notification-preferences"),
    path("<int:pk>/read/", NotificationMarkReadView.as_view(), name="notification-mark-read"),
    path("mark-all-read/", NotificationMarkAllReadView.as_view(), name="notification-mark-all-read"),
    path("<int:pk>/", NotificationDeleteView.as_view(), name="notification-delete"),
]
