from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import UserPrivacyPreference
from poems.models import Poem
from stories.models import Genre, Story


class SearchApiTests(APITestCase):
    def setUp(self):
        user_model = get_user_model()
        self.writer = user_model.objects.create_user(
            username="sabin",
            email="sabin@example.com",
            password="strongpass123",
        )
        self.private_user = user_model.objects.create_user(
            username="private-heather",
            email="private-heather@example.com",
            password="strongpass123",
            is_private=True,
        )
        self.hidden_user = user_model.objects.create_user(
            username="hidden-heather",
            email="hidden-heather@example.com",
            password="strongpass123",
        )
        UserPrivacyPreference.objects.create(user=self.hidden_user, show_in_search=False)
        self.genre = Genre.objects.create(name="Literary", type="story")
        self.story = Story.objects.create(
            title="Heather",
            synopsis="A public story about the garden",
            author=self.writer,
            genre=self.genre,
            status="published",
        )
        self.draft = Story.objects.create(
            title="Heather Draft",
            synopsis="Not public",
            author=self.writer,
            genre=self.genre,
            status="draft",
        )
        self.private_story = Story.objects.create(
            title="Private Heather",
            synopsis="Not discoverable",
            author=self.writer,
            genre=self.genre,
            status="published",
            is_private=True,
        )
        self.poem = Poem.objects.create(
            title="Heather in Rain",
            content="A short poem",
            author=self.writer,
            genre=self.genre,
            status="published",
        )

    def test_fuzzy_search_returns_categorized_public_results(self):
        response = self.client.get(reverse("search"), {"q": "heathre"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["query"], "heathre")
        self.assertEqual(response.data["stories"][0]["title"], "Heather")
        self.assertEqual(response.data["poems"][0]["title"], "Heather in Rain")
        usernames = {result["username"] for result in response.data["users"]}
        self.assertNotIn("private-heather", usernames)
        self.assertNotIn("hidden-heather", usernames)
        self.assertNotIn("Heather Draft", [result["title"] for result in response.data["stories"]])
        self.assertNotIn("Private Heather", [result["title"] for result in response.data["stories"]])

    def test_private_users_are_visible_only_to_themselves_or_followers(self):
        self.client.force_authenticate(user=self.private_user)

        own_result = self.client.get(reverse("search"), {"q": "private-heather"})
        self.assertIn("private-heather", [result["username"] for result in own_result.data["users"]])

        self.client.force_authenticate(user=self.writer)
        other_result = self.client.get(reverse("search"), {"q": "private-heather"})
        self.assertNotIn("private-heather", [result["username"] for result in other_result.data["users"]])

    def test_empty_query_returns_no_results(self):
        response = self.client.get(reverse("search"), {"q": "   "})

        self.assertEqual(response.data["total"], 0)
        self.assertEqual(response.data["stories"], [])
        self.assertEqual(response.data["poems"], [])
        self.assertEqual(response.data["users"], [])

    def test_results_support_independent_category_pages(self):
        Story.objects.create(
            title="Heather's Path",
            synopsis="A public sequel",
            author=self.writer,
            genre=self.genre,
            status="published",
        )

        response = self.client.get(reverse("search"), {"q": "heather", "limit": 1, "page": 2})

        self.assertEqual(response.data["page"], 2)
        self.assertEqual(len(response.data["stories"]), 1)
        self.assertFalse(response.data["has_more"]["stories"])