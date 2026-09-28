from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from poems.models import Poem
from stories.models import Genre, Story
from .models import Bookmark, Comment, Like


class InteractionContentListTests(APITestCase):
	def setUp(self):
		self.user = get_user_model().objects.create_user(
			username="reader",
			email="reader@example.com",
			password="strongpass123",
		)
		self.genre = Genre.objects.create(name="Literary", type="story")
		self.story = Story.objects.create(
			title="A Real Story",
			synopsis="A synopsis",
			author=self.user,
			genre=self.genre,
			status="published",
		)
		self.poem = Poem.objects.create(
			title="A Real Poem",
			content="A poem",
			author=self.user,
			genre=self.genre,
			status="published",
		)
		self.client.force_authenticate(user=self.user)

	def test_bookmarks_and_likes_return_content_items(self):
		Bookmark.objects.create(user=self.user, story=self.story)
		Like.objects.create(user=self.user, poem=self.poem)

		bookmarks = self.client.get(reverse("bookmarked-content"))
		likes = self.client.get(reverse("liked-content"))

		self.assertEqual(bookmarks.status_code, status.HTTP_200_OK)
		self.assertEqual(bookmarks.data[0]["content_id"], self.story.id)
		self.assertEqual(bookmarks.data[0]["content_type"], "story")
		self.assertEqual(likes.status_code, status.HTTP_200_OK)
		self.assertEqual(likes.data[0]["content_id"], self.poem.id)
		self.assertEqual(likes.data[0]["content_type"], "poem")

	def test_authenticated_user_can_create_review_with_rating(self):
		response = self.client.post(
			reverse("comments"),
			{"story": self.story.id, "body": "A thoughtful review.", "rating": 5},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data["rating"], 5)
		self.assertTrue(Comment.objects.filter(story=self.story, user=self.user).exists())

	def test_authenticated_user_can_review_a_poem(self):
		response = self.client.post(
			reverse("comments"),
			{"poem": self.poem.id, "body": "A lovely poem.", "rating": 4},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Comment.objects.filter(poem=self.poem, user=self.user, rating=4).exists())

	def test_review_requires_a_star_rating(self):
		response = self.client.post(
			reverse("comments"),
			{"story": self.story.id, "body": "A review without stars."},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertFalse(Comment.objects.filter(story=self.story).exists())
