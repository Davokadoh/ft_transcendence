from django.contrib.auth import authenticate
import os

class LoginView():
	user = authenticate(username="john", password="secret")
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            user.status = "online"  # type: ignore
            user.save()
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),  # type: ignore
                    "user": UserSerializer(user).data,
                },
                status=status.HTTP_200_OK,
            )
        else:
            raise AuthenticationFailed("Invalid Credentials")

class LoginView(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        url = "https://api.intra.42.fr/oauth/authorize?client_id={}&redirect_uri={}&response_type=code".format(
            os.getenv("CLIENT"), "http://localhost:8000/api/users/auth/callback"
        )
        return redirect(url)

    def authorize(self):
        response = ic.get("https://api.intra.42.fr/oauth/authorize?")
        print("AUTHORIZE : ", response)


class CallBackView(APIView):
    print("CALLBACKVIEW")

    def get(self, request, *args, **kwargs):
        print("CALLBACKVIEW GET")
        response = requests.post(
            "https://api.intra.42.fr/oauth/token",
            data={
                "grant_type": "authorization_code",
                "client_id": os.getenv("CLIENT"),
                "client_secret": os.getenv("SECRET"),
                "code": {request.GET.get("code")},
                "redirect_uri": "http://localhost:8000/api/users/auth/callback",
            },
        )
        data = response.json()
        response = requests.get(
            "https://api.intra.42.fr/v2/me",
            headers={"Authorization": f'Bearer {data['access_token']}'},
        )
        user = {}
        user["id"] = response.json()["id"]
        user["login"] = response.json()["login"]
        user["image"] = response.json()["image"]["versions"]["small"]
        user["access_token"] = data["access_token"]
        print(user)
        # Get or create the user
        User = get_user_model()
        username = f"{user['login']}#{user['id']}"
        print(username)
        # Try to get the user from the database
        try:
            existing_user = User.objects.get(username=username)
        except User.DoesNotExist:
            # If the user does not exist, create a new user
            existing_user = User.objects.create(username=username, image=user["image"])
        else:
            # If the user exists, update their image
            existing_user.image = user["image"]
            existing_user.save()

        # Generate a JWT token for the user
        refresh = RefreshToken.for_user(existing_user)

        # Return the token in the response
        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "user": UserSerializer(existing_user).data,
            }
        )


class CallBackCodeView(APIView):
    print("CALLBACKCODEVIEW")

    def get(self, request, *args, **kwargs):
        print(f'access token : {request.GET.get('code')}')


class LogoutView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        request.user.status = "offline"
        request.user.save()
        logout(request)
        return Response(...)