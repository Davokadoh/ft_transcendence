from .models import User
from django.shortcuts import redirect
from django.contrib.auth.backends import BaseBackend
import requests
import os


class CustomAuthenticationBackend(BaseBackend):
    async def authenticate(self, request):
        if request.auser.is_authenticated:
            return redirect("/home")

        if request.method == "POST": # Return request to be done by the client
            state = os.urandom(42)
            request = requests.get(
                "https://api.intra.42.fr/oauth/authorize",
                data={
                    "client_id": os.getenv("CLIENT"),
                    "redirect_uri": "http://localhost:8000/api/users/auth/callback",
                    "scope": "public",
                    "state": state,
                    "response_type": "code",
                },
            )
            return redirect(request, permanent=True) # Unsure about the permanent

        if request.method == "GET": # Request 42API auth, return user
            code = request.data.get("code")
            state = request.data.get("state")
            response = requests.post(
                "https://api.intra.42.fr/oauth/token",
                data={
                    "grant_type": "authorization_code",
                    "client_id": os.getenv("CLIENT"),
                    "client_secret": os.getenv("SECRET"),
                    "code": code,
                    "redirect_uri": "http://localhost:8000/",  # CHANGE TO ACTUAL CALLBACK URL
                    "state": "state",
                },
            )
            if response.status_code != '200':
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
