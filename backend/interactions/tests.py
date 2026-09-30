from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from poems.models import Poem
from stories.models import Chapter, Genre, Story
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

	def test_chapter_comments_support_unrated_posts_and_sorting(self):
		from datetime import timedelta
		from django.utils import timezone

		chapter = Chapter.objects.create(
			story=self.story,
			title="First Chapter",
			chapter_number=1,
			order=1,
			content="Chapter content",
		)
		created = self.client.post(
			reverse("comments"),
			{"chapter": chapter.id, "body": "A chapter comment."},
			format="json",
		)
		self.assertEqual(created.status_code, status.HTTP_201_CREATED)
		self.assertIsNone(created.data["rating"])
		self.assertEqual(created.data["like_count"], 0)

		base_time = timezone.now() - timedelta(days=1)
		older = Comment.objects.create(user=self.user, chapter=chapter, body="Older tie")
		newer = Comment.objects.create(user=self.user, chapter=chapter, body="Newer tie")
		most_liked = Comment.objects.create(user=self.user, chapter=chapter, body="Most liked")
		for comment, like_total in ((older, 2), (newer, 2), (most_liked, 5)):
			for index in range(like_total):
				liker = get_user_model().objects.create_user(
					username=f"liker-{comment.id}-{index}",
					email=f"liker-{comment.id}-{index}@example.com",
					password="strongpass123",
				)
				Like.objects.create(user=liker, comment=comment)
		Comment.objects.filter(pk=older.pk).update(created_at=base_time)
		Comment.objects.filter(pk=newer.pk).update(created_at=base_time + timedelta(seconds=1))
		Comment.objects.filter(pk=most_liked.pk).update(created_at=base_time + timedelta(seconds=2))

		most_liked_response = self.client.get(reverse("comments"), {"chapter": chapter.id})
		newest_response = self.client.get(reverse("comments"), {"chapter": chapter.id, "sort": "newest"})
		self.assertEqual(most_liked_response.status_code, status.HTTP_200_OK)
		self.assertEqual(
			[item["id"] for item in most_liked_response.data],
			[most_liked.id, newer.id, older.id, created.data["id"]],
		)
		self.assertEqual(
			[item["id"] for item in newest_response.data],
			[created.data["id"], most_liked.id, newer.id, older.id],
		)

	def test_chapter_comments_must_target_a_published_chapter(self):
		chapter = Chapter.objects.create(
			story=self.story,
			title="First Chapter",
			chapter_number=1,
			order=1,
			content="Chapter content",
		)
		self.story.status = "draft"
		self.story.save(update_fields=["status"])

		response = self.client.post(
			reverse("comments"),
			{"chapter": chapter.id, "body": "Unavailable comment."},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
		self.assertFalse(Comment.objects.filter(chapter=chapter).exists())

	def test_replies_must_match_the_same_content_target(self):
		chapter_one = Chapter.objects.create(
			story=self.story,
			title="Chapter One",
			chapter_number=1,
			order=1,
			content="Chapter one content",
		)
		chapter_two = Chapter.objects.create(
			story=self.story,
			title="Chapter Two",
			chapter_number=2,
			order=2,
			content="Chapter two content",
		)
		parent = Comment.objects.create(user=self.user, chapter=chapter_one, body="First comment")

		response = self.client.post(
			reverse("comments"),
			{"chapter": chapter_two.id, "body": "Wrong chapter reply", "parent": parent.id},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
		self.assertFalse(Comment.objects.filter(chapter=chapter_two, parent=parent).exists())

	def test_reply_to_story_review_does_not_require_a_second_rating(self):
		parent = Comment.objects.create(user=self.user, story=self.story, body="A review", rating=5)
		response = self.client.post(
			reverse("comments"),
			{"story": self.story.id, "parent": parent.id, "body": "A reply"},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data["parent"], parent.id)
		self.assertIsNone(response.data["rating"])

	def test_like_toggle_persists_and_comment_reads_return_real_state(self):
		parent = Comment.objects.create(user=self.user, story=self.story, body="A review", rating=5)

		for target_type, target_id in (("story", self.story.id), ("poem", self.poem.id), ("comment", parent.id)):
			url = reverse("toggle-like", kwargs={"target_type": target_type, "target_id": target_id})
			liked = self.client.post(url)
			self.assertEqual(liked.status_code, status.HTTP_200_OK)
			self.assertTrue(liked.data["is_liked"])
			self.assertEqual(liked.data["like_count"], 1)

			unliked = self.client.post(url)
			self.assertEqual(unliked.status_code, status.HTTP_200_OK)
			self.assertFalse(unliked.data["is_liked"])
			self.assertEqual(unliked.data["like_count"], 0)

		self.client.post(reverse("toggle-like", kwargs={"target_type": "comment", "target_id": parent.id}))
		comments = self.client.get(reverse("comments"), {"story": self.story.id})
		self.assertEqual(comments.status_code, status.HTTP_200_OK)
		self.assertEqual(comments.data[0]["like_count"], 1)
		self.assertTrue(comments.data[0]["is_liked"])

	def test_like_toggle_requires_authentication(self):
		self.client.force_authenticate(user=None)
		response = self.client.post(reverse("toggle-like", kwargs={"target_type": "story", "target_id": self.story.id}))
		self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_reply_to_a_chapter_comment_is_saved_as_a_reply(self):
		chapter = Chapter.objects.create(
			story=self.story,
			title="Chapter One",
			chapter_number=1,
			order=1,
			content="Chapter one content",
		)
		parent = Comment.objects.create(user=self.user, chapter=chapter, body="Original comment")

		response = self.client.post(
			reverse("comments"),
			{"chapter": chapter.id, "body": "Reply body", "parent": parent.id},
			format="json",
		)
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data["parent"], parent.id)
		self.assertTrue(Comment.objects.filter(parent=parent, chapter=chapter, body="Reply body").exists())
