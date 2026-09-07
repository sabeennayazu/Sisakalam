from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class StoriesEndpointTests(APITestCase):
    def test_stories_list_endpoint_is_available(self):
        response = self.client.get(reverse("story-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_authenticated_user_can_publish_a_story(self):
        from django.contrib.auth import get_user_model
        from stories.models import Genre

        user = get_user_model().objects.create_user(
            username="writer",
            email="writer@example.com",
            password="strongpass123",
        )
        genre = Genre.objects.create(name="Fiction", type="story")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            reverse("story-list"),
            {
                "title": "A Published Story",
                "synopsis": "A short synopsis.",
                "genre": genre.id,
                "tags": ["fiction"],
                "is_mature": False,
                "status": "published",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["author"], user.id)
        self.assertEqual(response.data["status"], "published")
