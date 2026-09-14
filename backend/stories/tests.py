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
                "content": "The first chapter begins here.",
                "status": "published",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["author"], user.id)
        self.assertEqual(response.data["status"], "published")

        from stories.models import Chapter
        chapter = Chapter.objects.get(story_id=response.data["id"])
        self.assertEqual(Chapter.objects.filter(story_id=response.data["id"]).count(), 1)
        self.assertEqual(chapter.chapter_number, 1)
        self.assertEqual(chapter.order, 1)
        self.assertEqual(chapter.content, "The first chapter begins here.")
        self.assertTrue(chapter.slug)

    def test_publishing_existing_draft_does_not_duplicate_chapter_one(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        user = get_user_model().objects.create_user(username="draftwriter", email="draft@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Drama", type="story")
        self.client.force_authenticate(user=user)
        response = self.client.post(reverse("story-list"), {"title": "Draft", "synopsis": "Draft synopsis", "genre": genre.id, "content": "Saved chapter body", "status": "draft"}, format="json")
        story = Story.objects.get(pk=response.data["id"])
        self.assertEqual(story.chapters.count(), 1)
        publish = self.client.post(reverse("story-publish", kwargs={"pk": story.pk}))
        self.assertEqual(publish.status_code, status.HTTP_200_OK)
        self.assertEqual(Chapter.objects.filter(story=story).count(), 1)
        self.assertEqual(story.chapters.get().content, "Saved chapter body")
