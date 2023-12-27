from django.test import TestCase
from .models import User
from django.test.utils import setup_test_environment

# Create your tests here.
class TestAuthEndpoints(TestCase):
	setup_test_environment()

	def test_account_login(self, api_client, active_user):
		client = Client()
		response = client.get("/login")

        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST