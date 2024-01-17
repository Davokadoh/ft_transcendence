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
            return redirect("/home")  # request.next ?

        state = os.urandom(42)
        auth_url = "{}/oauth/authorize?client_id={}&redirect_uri={}&scope={}&state={}&response_type=code".format(
            os.getenv("OAUTH_URL"),
            os.getenv("OAUTH_ID"),
            "http://localhost:8000/accounts/callback",
            "public",
            123,  # state
        )
        return redirect(auth_url)

    # Request 42API auth, return user, need to check state
    def callback(request):
        code = request.GET.get("code", "")
        state = request.GET.get("state", "")
        response = requests.post(
            "{}{}".format(
                os.getenv("OAUTH_URL"),
                "/oauth/access_token",
            ),
            data={
                "grant_type": "authorization_code",
                "client_id": os.getenv("OAUTH_ID"),
                "client_secret": os.getenv("OAUTH_SECRET"),
                "code": code,
                "redirect_uri": "http://localhost:8000/accounts/callback",
                "state": state,
            },
            headers={"Accept": "application/json"},
        )
        if not response.ok:
            print("Error, status code is: " + response.status_code)
            return None
        access_token = response.json()["access_token"]
        response = requests.get(
            os.getenv("OAUTH_USER_URL"),
            headers={"Authorization": "Bearer " + access_token},
        )
        print(response.json())

        try:
            user = User.objects.get(username=response.json()["login"])
        except User.DoesNotExist:
            user = User.objects.create_user(username=response.json()["login"])

        user.access_token = access_token

        return user

    def get_user(self, user_id):
        try:
            return User.objects.first()
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None