from .models import CustomUser
from django.contrib.auth.backends import BaseBackend


class CustomAuthenticationBackend(BaseBackend):
    def authenticate(self, request, token=None):
        if token is None:
            return None
        try:
            return CustomUser.objects.get(access_token=token)
        except CustomCustomUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return CustomUser.objects.get(pk=user_id)
        except CustomCustomUser.DoesNotExist:
            return None