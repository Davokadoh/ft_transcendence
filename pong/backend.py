from .models import User
from django.shortcuts import redirect
from django.contrib.auth.backends import BaseBackend
import requests
import os
from dotenv import load_dotenv


class CustomAuthenticationBackend(BaseBackend):
    load_dotenv()

    def authenticate(request):
        if request.user.is_authenticated:
            return redirect("/home")

        state = os.urandom(42)
        auth_url = "https://api.intra.42.fr/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
            os.getenv("API_42_CLIENT_ID"),
            "http://localhost:8000/accounts/callback",
            "public",
            123,  # state
        )
        return redirect(auth_url)

    # Request 42API auth, return user, need to check state
    def callback(request):
        code = request.GET.get('code', '')
        state = request.GET.get('state', '')
        response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": os.getenv("API_42_CLIENT_ID"),
                "client_secret": os.getenv("API_42_CLIENT_SECRET"),
                "code": code,
                "redirect_uri": "http://localhost:8000/accounts/callback",
                "state": state,
            },
        )
        if not response.ok:
            print("Error, status code is: " + response.status_code)
            return None
        access_token = response.json()["access_token"]
        response = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={"Authorization": "Bearer " + access_token},
        )

        try:
            user = User.objects.get(id=response.json()["id"])
        except User.DoesNotExist:
            user = User.objects.create_user(response.json())

        user.access_token.refresh(access_token)

        return user

    def get_user(self, request, **kwargs):
        if True:
            return User.objects.first()
        else:
            return None
