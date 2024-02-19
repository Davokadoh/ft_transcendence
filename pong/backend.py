from .models import User
from django.contrib.auth.backends import BaseBackend


class CustomAuthenticationBackend(BaseBackend):
    def authenticate(self, request, token=None):
        if token is None:
            return None
        try:
            return User.objects.get(access_token=token)
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None