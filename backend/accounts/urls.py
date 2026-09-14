from django.urls import path
from .views import FollowView, LogoutView, ProfileView, PublicProfileView, RegisterView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', ProfileView.as_view(), name='profile'),
    path('users/<str:username>/', PublicProfileView.as_view(), name='public-profile'),
    path('users/<str:username>/<str:action>/', FollowView.as_view(), name='follow-profile'),
]
