from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from stories.models import Genre


class PoemCreateTests(APITestCase):
	def test_authenticated_user_can_publish_a_poem(self):
		user = get_user_model().objects.create_user(
			username="poet",
			email="poet@example.com",
			password="strongpass123",
		)
		genre = Genre.objects.create(name="Poetry", type="poem")
		self.client.force_authenticate(user=user)

		response = self.client.post(
			reverse("poem-list"),
			{
				"title": "A Published Poem",
				"content": "Words in a quiet line.",
				"genre": genre.id,
				"tags": ["quiet"],
				"is_mature": False,
				"status": "published",
			},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data["author"], user.id)
		self.assertEqual(response.data["status"], "published")
		self.assertIsNotNone(response.data["published_at"])

	def test_owner_can_fetch_private_poem_but_public_user_cannot(self):
		user = get_user_model().objects.create_user(
			username="private-poet",
			email="private-poet@example.com",
			password="strongpass123",
		)
		genre = Genre.objects.create(name="Private Poetry", type="poem")
		self.client.force_authenticate(user=user)
		create_response = self.client.post(
			reverse("poem-list"),
			{
				"title": "A Private Poem",
				"content": "Only its author can read this.",
				"genre": genre.id,
				"is_private": True,
				"status": "published",
			},
			format="json",
		)
		poem_url = reverse("poem-detail", args=[create_response.data["id"]])

		self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(self.client.get(poem_url).status_code, status.HTTP_200_OK)

		self.client.force_authenticate(user=None)
		self.assertEqual(self.client.get(poem_url).status_code, status.HTTP_404_NOT_FOUND)

	def test_publishing_draft_sets_published_timestamp(self):
		user = get_user_model().objects.create_user(
			username="draft-poet",
			email="draft-poet@example.com",
			password="strongpass123",
		)
		genre = Genre.objects.create(name="Draft Poetry", type="poem")
		self.client.force_authenticate(user=user)
		create_response = self.client.post(
			reverse("poem-list"),
			{
				"title": "A Draft Poem",
				"content": "Soon to be published.",
				"genre": genre.id,
				"status": "draft",
			},
			format="json",
		)
		publish_response = self.client.patch(
			reverse("poem-detail", args=[create_response.data["id"]]),
			{"status": "published"},
			format="json",
		)

		self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(publish_response.status_code, status.HTTP_200_OK)
		self.assertIsNotNone(publish_response.data["published_at"])

# Create your tests here.
