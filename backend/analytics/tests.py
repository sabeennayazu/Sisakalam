from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from poems.models import Poem
from stories.models import Genre, Story


class ContentViewTrackingTests(APITestCase):
    def setUp(self):
        self.author = get_user_model().objects.create_user(
            username="author-one",
            email="author-one@example.com",
            password="strongpass123",
        )
        self.viewer = get_user_model().objects.create_user(
            username="viewer-one",
            email="viewer-one@example.com",
            password="strongpass123",
        )
        self.genre = Genre.objects.create(name="Test Genre", type="story")
        self.poem_genre = Genre.objects.create(name="Poem Genre", type="poem")

    def test_story_owner_does_not_count_as_view_and_duplicate_user_view_is_deduplicated(self):
        story = Story.objects.create(
            title="Story Title",
            synopsis="A story synopsis.",
            author=self.author,
            genre=self.genre,
            status="published",
        )

        self.client.force_authenticate(user=self.author)
        owner_response = self.client.post(reverse("story-view-event", args=[story.id]))
        self.assertEqual(owner_response.status_code, status.HTTP_200_OK)
        story.refresh_from_db()
        self.assertEqual(story.views, 0)
        self.assertFalse(owner_response.data["viewed"])

        self.client.force_authenticate(user=self.viewer)
        first_response = self.client.post(reverse("story-view-event", args=[story.id]))
        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertTrue(first_response.data["viewed"])
        self.assertTrue(first_response.data["is_new_view"])
        story.refresh_from_db()
        self.assertEqual(story.views, 1)

        second_response = self.client.post(reverse("story-view-event", args=[story.id]))
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertTrue(second_response.data["viewed"])
        self.assertFalse(second_response.data["is_new_view"])
        story.refresh_from_db()
        self.assertEqual(story.views, 1)

    def test_poem_owner_does_not_count_as_view_and_duplicate_user_view_is_deduplicated(self):
        poem = Poem.objects.create(
            title="Poem Title",
            content="Poem text goes here.",
            author=self.author,
            genre=self.poem_genre,
            status="published",
        )

        self.client.force_authenticate(user=self.author)
        owner_response = self.client.post(reverse("poem-view-event", args=[poem.id]))
        self.assertEqual(owner_response.status_code, status.HTTP_200_OK)
        poem.refresh_from_db()
        self.assertEqual(poem.views, 0)
        self.assertFalse(owner_response.data["viewed"])

        self.client.force_authenticate(user=self.viewer)
        first_response = self.client.post(reverse("poem-view-event", args=[poem.id]))
        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertTrue(first_response.data["viewed"])
        self.assertTrue(first_response.data["is_new_view"])
        poem.refresh_from_db()
        self.assertEqual(poem.views, 1)

        second_response = self.client.post(reverse("poem-view-event", args=[poem.id]))
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        self.assertTrue(second_response.data["viewed"])
        self.assertFalse(second_response.data["is_new_view"])
        poem.refresh_from_db()
        self.assertEqual(poem.views, 1)
