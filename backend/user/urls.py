from django.urls import path

from .views import login

urlpatterns = [
    path("", login.as_view(), name="login"),
]