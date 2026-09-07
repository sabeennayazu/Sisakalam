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

# Create your tests here.
