from django.urls import reverse
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
