from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics, serializers, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404
from .serializers import (
    CustomTokenObtainPairSerializer,
    ProfileImageUploadSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
)
from .models import Follow, User
from notifications.services import create_notification


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)
        return Response({
            **tokens,
            "message": "User created successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            }
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]

    def serialize_profile(self, request, user):
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": user.bio,
            "location": user.location,
            "website": user.website,
            "profile_picture": request.build_absolute_uri(user.profile_picture.url)
            if user.profile_picture else None,
            "followers": user.followers_count,
            "following": user.following_count,
            "works": user.total_poems + user.total_stories,
        }

    def get(self, request):
        return Response(self.serialize_profile(request, request.user))

    def patch(self, request):
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(self.serialize_profile(request, user))


class ProfileImageUploadView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]
    serializer_class = ProfileImageUploadSerializer

    def post(self, request):
        serializer = self.get_serializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "profile_picture": request.build_absolute_uri(user.profile_picture.url),
        }, status=status.HTTP_200_OK)


class PublicProfileView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    lookup_field = "username"
    lookup_url_kwarg = "username"
    queryset = User.objects.all()

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        is_following = request.user.is_authenticated and Follow.objects.filter(
            follower=request.user,
            following=user,
        ).exists()
        return Response({
            "id": user.id,
            "username": user.username,
            "bio": user.bio,
            "location": user.location,
            "website": user.website,
            "profile_picture": request.build_absolute_uri(user.profile_picture.url)
            if user.profile_picture else None,
            "followers": user.followers_count,
            "following": user.following_count,
            "works": user.total_poems + user.total_stories,
            "is_private": user.is_private,
            "is_following": is_following,
        })


class FollowView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, username, action):
        target = get_object_or_404(User, username=username)
        if target == request.user:
            return Response({"detail": "You cannot follow yourself."}, status=status.HTTP_400_BAD_REQUEST)

        relation = Follow.objects.filter(follower=request.user, following=target)
        if action == "follow":
            _, created = Follow.objects.get_or_create(follower=request.user, following=target)
            if created:
                create_notification(
                    recipient=target,
                    actor=request.user,
                    notification_type="follow",
                    message="started following you",
                    target=target,
                )
        else:
            relation.delete()

        target.followers_count = Follow.objects.filter(following=target).count()
        target.save(update_fields=["followers_count"])
        request.user.following_count = Follow.objects.filter(follower=request.user).count()
        request.user.save(update_fields=["following_count"])
        return Response({"is_following": action == "follow", "followers": target.followers_count})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"detail": "Refresh token is required."},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(
                {"detail": "Invalid or expired token."},
                status=status.HTTP_400_BAD_REQUEST,
            )
