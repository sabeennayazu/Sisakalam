import shutil
import tempfile
from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase


class AuthEndpointTests(APITestCase):
    def test_register_returns_access_and_refresh_tokens(self):
        response = self.client.post(
            reverse("register"),
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "strongpass123",
                "password_confirm": "strongpass123",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)
        self.assertEqual(response.data["user"]["email"], "new@example.com")

    def test_me_returns_profile_header_fields(self):
        from django.contrib.auth import get_user_model

        user = get_user_model().objects.create_user(
            username="profileuser",
            email="profile@example.com",
            password="strongpass123",
            bio="A profile bio",
            location="Lagos",
            website="https://example.com",
            followers_count=4,
            following_count=2,
            total_poems=3,
            total_stories=1,
        )
        self.client.force_authenticate(user=user)

        response = self.client.get(reverse("profile"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "profileuser")
        self.assertEqual(response.data["bio"], "A profile bio")
        self.assertEqual(response.data["location"], "Lagos")
        self.assertEqual(response.data["website"], "https://example.com")
        self.assertEqual(response.data["followers"], 4)
        self.assertEqual(response.data["following"], 2)
        self.assertEqual(response.data["works"], 4)

    def test_public_profile_and_follow_actions_use_username(self):
        from django.contrib.auth import get_user_model

        viewer = get_user_model().objects.create_user(
            username="viewer",
            email="viewer@example.com",
            password="strongpass123",
        )
        target = get_user_model().objects.create_user(
            username="john-doe",
            email="john@example.com",
            password="strongpass123",
        )
        self.client.force_authenticate(user=viewer)

        profile = self.client.get(reverse("public-profile", kwargs={"username": "john-doe"}))
        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data["id"], target.id)
        self.assertFalse(profile.data["is_following"])

        followed = self.client.post(reverse("follow-profile", kwargs={"username": "john-doe", "action": "follow"}))
        self.assertEqual(followed.status_code, status.HTTP_200_OK)
        self.assertTrue(followed.data["is_following"])

        unfollowed = self.client.post(reverse("follow-profile", kwargs={"username": "john-doe", "action": "unfollow"}))
        self.assertEqual(unfollowed.status_code, status.HTTP_200_OK)
        self.assertFalse(unfollowed.data["is_following"])

    def test_relationship_lists_return_user_profiles_and_viewer_relationship(self):
        from django.contrib.auth import get_user_model
        from .models import Follow

        viewer = get_user_model().objects.create_user(username="viewer", email="viewer@example.com", password="strongpass123")
        target = get_user_model().objects.create_user(username="target", email="target@example.com", password="strongpass123")
        other = get_user_model().objects.create_user(username="other", email="other@example.com", password="strongpass123", first_name="Other", last_name="Writer")
        Follow.objects.create(follower=viewer, following=target)
        Follow.objects.create(follower=target, following=other)
        self.client.force_authenticate(user=viewer)

        followers = self.client.get(reverse("followers-list", kwargs={"user_id": target.id}))
        following = self.client.get(reverse("following-list", kwargs={"user_id": target.id}))

        self.assertEqual(followers.status_code, status.HTTP_200_OK)
        self.assertEqual(followers.data[0]["username"], "viewer")
        self.assertFalse(followers.data[0]["is_following"])
        self.assertEqual(following.status_code, status.HTTP_200_OK)
        self.assertEqual(following.data[0]["display_name"], "Other Writer")
        self.assertFalse(following.data[0]["is_following"])

    def test_only_profile_owner_can_remove_follower_and_counts_update(self):
        from django.contrib.auth import get_user_model
        from .models import Follow

        owner = get_user_model().objects.create_user(username="owner", email="owner@example.com", password="strongpass123")
        follower = get_user_model().objects.create_user(username="follower", email="follower@example.com", password="strongpass123")
        Follow.objects.create(follower=follower, following=owner)
        owner.followers_count = 1
        owner.save(update_fields=["followers_count"])

        self.client.force_authenticate(user=follower)
        denied = self.client.post(reverse("remove-follower", kwargs={"user_id": owner.id}), {"follower_id": follower.id}, format="json")
        self.assertEqual(denied.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=owner)
        removed = self.client.post(reverse("remove-follower", kwargs={"user_id": owner.id}), {"follower_id": follower.id}, format="json")
        self.assertEqual(removed.status_code, status.HTTP_200_OK)
        self.assertEqual(removed.data["followers"], 0)
        follower.refresh_from_db()
        self.assertEqual(follower.following_count, 0)


class ProfileUpdateAndImageTests(APITestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model

        self.media_root = tempfile.mkdtemp(prefix="sisakalam-profile-test-")
        self.media_override = override_settings(MEDIA_ROOT=self.media_root)
        self.media_override.enable()
        self.addCleanup(self.cleanup_media)
        self.user = get_user_model().objects.create_user(
            username="imageowner",
            email="imageowner@example.com",
            password="strongpass123",
        )
        self.client.force_authenticate(user=self.user)

    def cleanup_media(self):
        self.media_override.disable()
        shutil.rmtree(self.media_root, ignore_errors=True)

    def test_profile_fields_can_be_updated_without_changing_other_data(self):
        response = self.client.patch(
            reverse("profile"),
            {"bio": "Updated biography", "location": "Kathmandu"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["bio"], "Updated biography")
        self.assertEqual(response.data["location"], "Kathmandu")
        self.assertEqual(response.data["username"], "imageowner")

    def test_profile_image_upload_returns_the_authoritative_image_url(self):
        image_data = BytesIO()
        Image.new("RGB", (2, 2), color="black").save(image_data, format="PNG")
        upload = SimpleUploadedFile("avatar.png", image_data.getvalue(), content_type="image/png")

        response = self.client.post(
            reverse("profile-avatar-upload"),
            {"profile_picture": upload},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("/media/profile_pictures/", response.data["profile_picture"])
        self.user.refresh_from_db()
        self.assertTrue(self.user.profile_picture.name.endswith(".png"))

    def test_profile_image_upload_rejects_unsupported_formats(self):
        upload = SimpleUploadedFile("avatar.gif", b"not an image", content_type="image/gif")

        response = self.client.post(
            reverse("profile-avatar-upload"),
            {"profile_picture": upload},
            format="multipart",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.user.refresh_from_db()
        self.assertFalse(self.user.profile_picture)
