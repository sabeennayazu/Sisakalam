from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class StoriesEndpointTests(APITestCase):
    def test_stories_list_endpoint_is_available(self):
        response = self.client.get(reverse("story-list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
