from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("", views.index),
    path("accounts/login/", views.loginview),
    path("accounts/callback/", views.callback),
    path("accounts/logout/", views.logoutview),
    path("accounts/profil/", views.profil),
    path("accounts/profil/picture/", views.profilPicture),
    path("accounts/profil/username/", views.username),
    path("home/", views.home),
    path("chat/", views.chat),
    path("play/", views.play),
    path("profil/", views.profil),
    path("lobby/", views.lobby),
    path("lobby/<int:game_id>/", views.lobby),
    path("game/<int:game_id>/", views.game),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

