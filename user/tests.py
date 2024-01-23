from django.test import TestCase, Client
from django.test.utils import setup_test_environment
from .models import User

# Create your tests here.
class TestAuthEndpoints(TestCase):
	#setup_test_environment()

	def test_account_login(self):
		client = Client()
		response = client.post('http://localhost/login')
		print("response: ", response)
		#response = client.get(response.url, response.data, format='json')
		#self.assertTrue(response.context['user'].is_authenticated)
		#assert response.status_code == 200