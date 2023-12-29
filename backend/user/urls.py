from django.urls import path

from .views import login, callback

urlpatterns = [
    path("", login.as_view(), name="login"),
    path("", callback.as_view(), name="callback"),
]