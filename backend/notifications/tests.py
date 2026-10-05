from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from accounts.models import Follow
from interactions.models import Comment
from .models import Notification, NotificationPreference


class NotificationEventTests(APITestCase):
	def setUp(self):
		user_model = get_user_model()
		self.author = user_model.objects.create_user(
			username="notification-author",
			email="notification-author@example.com",
			password="strongpass123",
		)
		self.follower = user_model.objects.create_user(
			username="notification-follower",
			email="notification-follower@example.com",
			password="strongpass123",
		)
		self.replier = user_model.objects.create_user(
			username="notification-replier",
			email="notification-replier@example.com",
			password="strongpass123",
		)
		Follow.objects.create(follower=self.follower, following=self.author)

	def test_publication_and_chapter_creation_notify_followers(self):
		self.client.force_authenticate(user=self.author)
		story_response = self.client.post(reverse("story-list"), {
			"title": "A Published Story",
			"synopsis": "A short synopsis",
			"content": "The opening chapter",
			"status": "published",
		}, format="json")
		self.assertEqual(story_response.status_code, status.HTTP_201_CREATED)
		story_id = story_response.data["id"]

		poem_response = self.client.post(reverse("poem-list"), {
			"title": "A Published Poem",
			"content": "A short poem",
			"status": "published",
		}, format="json")
		self.assertEqual(poem_response.status_code, status.HTTP_201_CREATED)

		chapter_response = self.client.post(reverse("story-chapters", kwargs={"story_id": story_id}), {
			"title": "The Next Chapter",
			"content": "The next part",
		}, format="json")
		self.assertEqual(chapter_response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(
			set(Notification.objects.filter(recipient=self.follower).values_list("notification_type", flat=True)),
			{"new_story", "new_poem", "new_chapter"},
		)

		self.client.force_authenticate(user=self.follower)
		feed = self.client.get(reverse("notification-list"))
		self.assertEqual(feed.status_code, status.HTTP_200_OK)
		self.assertEqual(feed.data["count"], 3)
		chapter_notification = next(item for item in feed.data["results"] if item["type"] == "new_chapter")
		self.assertEqual(chapter_notification["actor"]["username"], self.author.username)
		self.assertIn("A Published Story", chapter_notification["target_title"])
		self.assertTrue(chapter_notification["target_url"].startswith(f"/stories/{story_id}/"))

	def test_follow_like_comment_and_reply_events_respect_recipients(self):
		from poems.models import Poem
		from stories.models import Chapter, Story

		story = Story.objects.create(
			title="Interaction Story",
			synopsis="A synopsis",
			author=self.author,
			status="published",
		)
		chapter = Chapter.objects.create(
			story=story,
			title="Opening",
			chapter_number=1,
			order=1,
			content="Chapter text",
		)
		poem = Poem.objects.create(
			title="Interaction Poem",
			content="Poem text",
			author=self.author,
			status="published",
		)

		self.client.force_authenticate(user=self.follower)
		follow_url = reverse("follow-profile", kwargs={"username": self.replier.username, "action": "follow"})
		self.assertEqual(self.client.post(follow_url).status_code, status.HTTP_200_OK)
		self.client.post(follow_url)
		self.assertEqual(Notification.objects.filter(recipient=self.replier, notification_type="follow").count(), 1)

		self.client.post(reverse("toggle-like", kwargs={"target_type": "story", "target_id": story.pk}))
		self.client.post(reverse("toggle-like", kwargs={"target_type": "poem", "target_id": poem.pk}))
		comment_response = self.client.post(reverse("comments"), {
			"story": story.pk,
			"body": "A useful comment",
			"rating": 5,
		}, format="json")
		self.assertEqual(comment_response.status_code, status.HTTP_201_CREATED)
		comment_id = comment_response.data["id"]

		self.client.force_authenticate(user=self.replier)
		reply_response = self.client.post(reverse("comments"), {
			"story": story.pk,
			"parent": comment_id,
			"body": "A reply",
		}, format="json")
		self.assertEqual(reply_response.status_code, status.HTTP_201_CREATED)

		self.assertEqual(Notification.objects.filter(recipient=self.author, notification_type="story_like").count(), 1)
		self.assertEqual(Notification.objects.filter(recipient=self.author, notification_type="poem_like").count(), 1)
		self.assertTrue(Notification.objects.filter(recipient=self.author, notification_type="comment").exists())
		self.assertTrue(Notification.objects.filter(recipient=self.follower, notification_type="reply").exists())
		self.assertTrue(Comment.objects.filter(pk=comment_id, chapter__isnull=True).exists())

	def test_followed_updates_preference_suppresses_fanout(self):
		NotificationPreference.objects.create(user=self.follower, followed_updates=False)
		self.client.force_authenticate(user=self.author)
		response = self.client.post(reverse("poem-list"), {
			"title": "Quiet Poem",
			"content": "A poem without a notification",
			"status": "published",
		}, format="json")
		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertFalse(Notification.objects.filter(recipient=self.follower, notification_type="new_poem").exists())

	def test_adding_story_and_poem_bookmarks_notifies_authors_once_per_add(self):
		from poems.models import Poem
		from stories.models import Story

		story = Story.objects.create(
			title="Bookmarked Story",
			synopsis="A synopsis",
			author=self.author,
			status="published",
		)
		poem = Poem.objects.create(
			title="Bookmarked Poem",
			content="Poem text",
			author=self.author,
			status="published",
		)
		legacy_story = Story.objects.create(
			title="Legacy Bookmark Story",
			synopsis="A synopsis",
			author=self.author,
			status="published",
		)
		self.client.force_authenticate(user=self.follower)

		story_url = reverse("toggle-bookmark", kwargs={"target_type": "story", "target_id": story.pk})
		poem_url = reverse("toggle-bookmark", kwargs={"target_type": "poem", "target_id": poem.pk})
		self.assertTrue(self.client.post(story_url).data["is_bookmarked"])
		self.assertFalse(self.client.post(story_url).data["is_bookmarked"])
		self.assertTrue(self.client.post(poem_url).data["is_bookmarked"])
		legacy_url = reverse("bookmark-story", kwargs={"pk": legacy_story.pk})
		self.assertEqual(self.client.post(legacy_url).status_code, status.HTTP_201_CREATED)
		self.assertEqual(self.client.post(legacy_url).status_code, status.HTTP_400_BAD_REQUEST)

		notifications = Notification.objects.filter(recipient=self.author)
		self.assertEqual(notifications.count(), 3)
		self.assertEqual(notifications.filter(notification_type="story_bookmark").count(), 2)
		self.assertEqual(notifications.filter(notification_type="poem_bookmark").count(), 1)

# Create your tests here.
