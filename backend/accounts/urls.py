from django.urls import path
from .views import FollowView, LogoutView, ProfileImageUploadView, ProfileView, PublicProfileView, RegisterView, CustomTokenObtainPairView, RelationshipListView, RemoveFollowerView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', ProfileView.as_view(), name='profile'),
    path('me/avatar/', ProfileImageUploadView.as_view(), name='profile-avatar-upload'),
    path('users/<str:username>/', PublicProfileView.as_view(), name='public-profile'),
    path('users/<int:user_id>/followers/', RelationshipListView.as_view(), {'relationship': 'followers'}, name='followers-list'),
    path('users/<int:user_id>/following/', RelationshipListView.as_view(), {'relationship': 'following'}, name='following-list'),
    path('users/<int:user_id>/remove-follower/', RemoveFollowerView.as_view(), name='remove-follower'),
    path('users/<str:username>/<str:action>/', FollowView.as_view(), name='follow-profile'),
]
