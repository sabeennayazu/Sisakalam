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
from .models import Follow, User, UserPrivacyPreference
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


class RelationshipListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id, relationship):
        target = get_object_or_404(User, pk=user_id)
        is_owner = request.user.is_authenticated and request.user.id == target.id
        is_target_follower = request.user.is_authenticated and Follow.objects.filter(
            follower=request.user,
            following=target,
        ).exists()

        if target.is_private and not (is_owner or is_target_follower):
            return Response({"detail": "You do not have permission to view this list."}, status=status.HTTP_403_FORBIDDEN)
        if relationship == "followers" and not is_owner and UserPrivacyPreference.objects.filter(
            user=target,
            hide_followers_list=True,
        ).exists():
            return Response({"detail": "You do not have permission to view this list."}, status=status.HTTP_403_FORBIDDEN)

        relation_field = "following" if relationship == "followers" else "follower"
        user_field = "follower" if relationship == "followers" else "following"
        relations = Follow.objects.filter(**{relation_field: target}).select_related(user_field).order_by("-created_at")
        related_users = [getattr(relation, user_field) for relation in relations]
        viewer_following_ids = set()
        if request.user.is_authenticated and related_users:
            viewer_following_ids = set(Follow.objects.filter(
                follower=request.user,
                following_id__in=[user.id for user in related_users],
            ).values_list("following_id", flat=True))

        return Response([
            {
                "id": user.id,
                "username": user.username,
                "display_name": user.get_full_name().strip() or user.username,
                "profile_picture": request.build_absolute_uri(user.profile_picture.url)
                if user.profile_picture else None,
                "is_following": user.id in viewer_following_ids,
            }
            for user in related_users
        ])


class RemoveFollowerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        target = get_object_or_404(User, pk=user_id)
        if request.user.id != target.id:
            return Response({"detail": "Only the profile owner can remove a follower."}, status=status.HTTP_403_FORBIDDEN)

        follower_id = request.data.get("follower_id")
        if not follower_id:
            return Response({"detail": "follower_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        relation = Follow.objects.filter(follower_id=follower_id, following=target)
        if not relation.exists():
            return Response({"detail": "This user is not a follower."}, status=status.HTTP_404_NOT_FOUND)
        relation.delete()

        target.followers_count = Follow.objects.filter(following=target).count()
        target.save(update_fields=["followers_count"])
        follower = get_object_or_404(User, pk=follower_id)
        follower.following_count = Follow.objects.filter(follower=follower).count()
        follower.save(update_fields=["following_count"])
        return Response({"followers": target.followers_count})


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
