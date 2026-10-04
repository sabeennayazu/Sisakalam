from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class StoriesEndpointTests(APITestCase):
    def test_draft_story_content_and_metadata_survive_fetch_and_update(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        user = get_user_model().objects.create_user(username="draft-flow-writer", email="draft-flow-story@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Draft Flow Fiction", type="story")
        self.client.force_authenticate(user=user)

        created = self.client.post(reverse("story-list"), {
            "title": "Initial title",
            "content": "Initial chapter text",
            "status": "draft",
        }, format="json")
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        story = Story.objects.get(pk=created.data["id"])
        chapter = Chapter.objects.get(story=story)
        self.assertEqual(chapter.content, "Initial chapter text")
        self.assertIsNone(story.genre)

        draft_url = reverse("story-detail", kwargs={"pk": story.pk})
        loaded = self.client.get(draft_url)
        self.assertEqual(loaded.status_code, status.HTTP_200_OK)
        self.assertEqual(self.client.get(reverse("story-chapters", kwargs={"story_id": story.pk})).data[0]["content"], "Initial chapter text")

        updated = self.client.patch(draft_url, {
            "title": "Updated title",
            "synopsis": "Updated synopsis",
            "genre": genre.id,
            "tags": ["edited"],
            "content": "Updated chapter text",
            "is_mature": True,
            "is_private": True,
        }, format="json")
        self.assertEqual(updated.status_code, status.HTTP_200_OK)
        self.assertEqual(updated.data["title"], "Updated title")
        self.assertEqual(updated.data["synopsis"], "Updated synopsis")
        self.assertEqual(updated.data["genre"], genre.id)
        self.assertEqual(updated.data["tag_names"], ["edited"])
        self.assertTrue(updated.data["is_mature"])
        self.assertTrue(updated.data["is_private"])
        listed = self.client.get(reverse("story-list"), {"mine": 1, "status": "draft"})
        self.assertIn(story.id, [record["id"] for record in listed.data["results"]])
        chapter.refresh_from_db()
        self.assertEqual(chapter.content, "Updated chapter text")
        published = self.client.post(reverse("story-publish", kwargs={"pk": story.pk}))
        self.assertEqual(published.status_code, status.HTTP_200_OK)
        self.assertEqual(Chapter.objects.filter(story=story).count(), 1)
        chapter.refresh_from_db()
        self.assertEqual(chapter.content, "Updated chapter text")

        self.client.force_authenticate(user=None)
        self.assertEqual(self.client.get(draft_url).status_code, status.HTTP_404_NOT_FOUND)

    def test_only_owner_can_delete_a_story_draft(self):
        from django.contrib.auth import get_user_model
        from stories.models import Genre, Story

        user_model = get_user_model()
        owner = user_model.objects.create_user(username="delete-story-owner", email="delete-story-owner@example.com", password="strongpass123")
        other = user_model.objects.create_user(username="delete-story-other", email="delete-story-other@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Deletion Fiction", type="story")
        story = Story.objects.create(title="Delete me", synopsis="Draft", author=owner, genre=genre, status="draft")
        story_url = reverse("story-detail", kwargs={"pk": story.pk})

        self.client.force_authenticate(user=other)
        self.assertEqual(self.client.delete(story_url).status_code, status.HTTP_404_NOT_FOUND)
        self.client.force_authenticate(user=owner)
        self.assertEqual(self.client.delete(story_url).status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Story.objects.filter(pk=story.pk).exists())

    def test_stories_list_endpoint_is_available(self):
        response = self.client.get(reverse("story-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_story_owner_can_access_own_draft_or_private_story(self):
        from django.contrib.auth import get_user_model
        from stories.models import Genre, Story

        user = get_user_model().objects.create_user(
            username="draftviewer",
            email="draftviewer@example.com",
            password="strongpass123",
        )
        genre = Genre.objects.create(name="Fantasy", type="story")
        story = Story.objects.create(
            title="Private Draft",
            synopsis="This should be viewable by its author.",
            author=user,
            genre=genre,
            status="draft",
            is_private=True,
        )

        self.client.force_authenticate(user=user)
        response = self.client.get(reverse("story-detail", kwargs={"pk": story.pk}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], story.id)
        self.assertEqual(response.data["status"], "draft")

    def test_only_owner_can_read_chapter_of_private_draft(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        user_model = get_user_model()
        owner = user_model.objects.create_user(username="chapterowner", email="chapterowner@example.com", password="strongpass123")
        other = user_model.objects.create_user(username="chapterother", email="chapterother@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Private Fiction", type="story")
        story = Story.objects.create(title="Private", synopsis="Draft", author=owner, genre=genre, status="draft", is_private=True)
        chapter = Chapter.objects.create(story=story, title="Opening", chapter_number=1, order=1, content="Private chapter body")

        self.client.force_authenticate(user=other)
        denied = self.client.get(reverse("story-chapter-by-slug", kwargs={"story_id": story.id, "slug": chapter.slug}))
        self.assertEqual(denied.status_code, status.HTTP_404_NOT_FOUND)

        self.client.force_authenticate(user=owner)
        allowed = self.client.get(reverse("story-chapter-by-slug", kwargs={"story_id": story.id, "slug": chapter.slug}))
        self.assertEqual(allowed.status_code, status.HTTP_200_OK)
        self.assertEqual(allowed.data["content"], "Private chapter body")

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

    def test_publishing_autosaved_draft_creates_chapter_from_final_content(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        user = get_user_model().objects.create_user(username="autosaved", email="autosaved@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Speculative", type="story")
        self.client.force_authenticate(user=user)
        draft_response = self.client.post(
            reverse("story-list"),
            {"title": "Autosaved Story", "synopsis": "Synopsis", "genre": genre.id, "status": "draft"},
            format="json",
        )
        story = Story.objects.get(pk=draft_response.data["id"])
        self.assertFalse(story.chapters.exists())

        response = self.client.patch(
            reverse("story-detail", kwargs={"pk": story.pk}),
            {"status": "published", "content": "The final editor content."},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        chapter = Chapter.objects.get(story=story)
        self.assertEqual(chapter.chapter_number, 1)
        self.assertEqual(chapter.content, "The final editor content.")
        self.assertEqual(Chapter.objects.filter(story=story).count(), 1)

    def test_published_story_requires_initial_content_and_does_not_persist_partial_story(self):
        from django.contrib.auth import get_user_model
        from stories.models import Genre, Story

        user = get_user_model().objects.create_user(username="emptywriter", email="empty@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Short Fiction", type="story")
        self.client.force_authenticate(user=user)

        response = self.client.post(
            reverse("story-list"),
            {"title": "Empty", "synopsis": "No content", "genre": genre.id, "status": "published"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(Story.objects.filter(title="Empty").exists())

    def test_story_edit_does_not_duplicate_or_overwrite_initial_chapter(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        user = get_user_model().objects.create_user(username="editwriter", email="edit@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Mystery", type="story")
        story = Story.objects.create(title="Editable", synopsis="Synopsis", author=user, genre=genre, status="published")
        chapter = Chapter.objects.create(story=story, title="Editable", chapter_number=1, order=1, content="Original chapter")
        self.client.force_authenticate(user=user)

        response = self.client.patch(
            reverse("story-detail", kwargs={"pk": story.pk}),
            {"title": "Edited title", "content": "Replacement content"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(story.chapters.count(), 1)
        chapter.refresh_from_db()
        self.assertEqual(chapter.content, "Original chapter")

    def test_published_chapter_is_retrievable_by_slug(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        user = get_user_model().objects.create_user(username="readerwriter", email="readerwriter@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Adventure", type="story")
        story = Story.objects.create(title="Readable", synopsis="Synopsis", author=user, genre=genre, status="published")
        chapter = Chapter.objects.create(story=story, title="Chapter One", chapter_number=1, order=1, content="Original story content")

        response = self.client.get(reverse("story-chapter-by-slug", kwargs={"story_id": story.id, "slug": chapter.slug}))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["content"], "Original story content")

        index_response = self.client.get(
            reverse("story-chapters", kwargs={"story_id": story.id}),
            {"metadata": 1},
        )
        self.assertEqual(index_response.status_code, status.HTTP_200_OK)
        self.assertNotIn("content", index_response.data[0])
        self.assertEqual(index_response.data[0]["slug"], chapter.slug)

    def test_only_story_owner_can_create_sequential_chapters(self):
        from django.contrib.auth import get_user_model
        from stories.models import Chapter, Genre, Story

        owner = get_user_model().objects.create_user(username="owner", email="owner@example.com", password="strongpass123")
        other = get_user_model().objects.create_user(username="other", email="other@example.com", password="strongpass123")
        genre = Genre.objects.create(name="Serial", type="story")
        story = Story.objects.create(title="Serial Story", synopsis="Synopsis", author=owner, genre=genre, status="published")
        Chapter.objects.create(story=story, title="First", chapter_number=1, order=1, content="One")

        self.client.force_authenticate(user=other)
        denied = self.client.post(reverse("story-chapters", kwargs={"story_id": story.id}), {"title": "Nope", "content": "Nope"}, format="json")
        self.assertEqual(denied.status_code, status.HTTP_403_FORBIDDEN)
        denied_edit = self.client.patch(reverse("story-chapter-detail", kwargs={"story_id": story.id, "pk": story.chapters.get().pk}), {"title": "Nope"}, format="json")
        self.assertEqual(denied_edit.status_code, status.HTTP_403_FORBIDDEN)
        denied_delete = self.client.delete(reverse("story-chapter-detail", kwargs={"story_id": story.id, "pk": story.chapters.get().pk}))
        self.assertEqual(denied_delete.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=owner)
        created = self.client.post(reverse("story-chapters", kwargs={"story_id": story.id}), {"title": "Second", "slug": "caller-supplied", "content": "Two"}, format="json")
        self.assertEqual(created.status_code, status.HTTP_201_CREATED)
        self.assertEqual(created.data["chapter_number"], 2)
        self.assertEqual(created.data["order"], 2)
        self.assertEqual(created.data["slug"], "second")
