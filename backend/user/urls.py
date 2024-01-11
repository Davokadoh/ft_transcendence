from django.urls import path

from .views import login, callback

urlpatterns = [
    path("login", login.as_view(), name="login"),
    path("callback", callback.as_view(), name="callback"),
]
