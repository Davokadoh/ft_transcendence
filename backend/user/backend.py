from .models import User
from django.shortcuts import redirect
from django.contrib.auth.backends import BaseBackend
import requests
import os


class CustomAuthenticationBackend(BaseBackend):
    def authenticate(request):
        if request.user.is_authenticated:
            return redirect("/home")

        # Return request to be done by the client
        if request.method == "POST":
            state = os.urandom(42)
            auth_url = "https://api.intra.42.fr/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
                123, #os.getenv("API_42_CLIENT_ID")
                "http://localhost:8000/callback",
                "public",
                123, #state
            )
            print(request)
            return redirect(auth_url)

    def callback(request):
        # Request 42API auth, return user, need to check state
        if request.method == "GET":
            code = request.data.get("code")
            state = request.data.get("state")
            response = requests.post(
                "https://api.intra.42.fr/oauth/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": os.getenv("CLIENT"),
                    "client_secret": os.getenv("SECRET"),
                    "code": code,
                    "redirect_uri": "http://localhost:8000/home",  # CHANGE TO ACTUAL CALLBACK URL
                    "state": state,
                },
            )
            if response.status_code != "200":
                return print("Error: " + response.status_code)
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
