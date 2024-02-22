from django.views.generic.base import RedirectView
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views
from .views import create_fake_user

urlpatterns = [
    path('', views.home, name='home'),
    path("", views.index),
	path('favicon.ico', RedirectView.as_view(url=static('favicon.ico'))),
    path("accounts/login/", views.loginview),
    path("accounts/callback/", views.callback),
    path("accounts/logout/", views.logoutview),
    path("accounts/profil/", views.profil),
    path("accounts/profil/picture/", views.profilPicture),
    path("accounts/profil/username/", views.username),
    path("home/", views.home),
    path("chat/", views.chat),
    path("chat/chat-tmp/", views.chat),
    path("play/", views.play),
    path("profil/", views.profil),
    path("user/", views.user),
    path("lobby/", views.lobby),
    path("lobby/<int:game_id>/", views.lobby),
    path("game/<int:game_id>/", views.game),
	path("remLobby/", views.remLobby),
    path("remLobby/<int:remote_id>/", views.remLobby),
    path("remote/<int:remote_id>/", views.remote),
	path("tourLobby/", views.tourLobby),
    path("tourLobby/<int:tournament_id>/", views.tourLobby),
    path("tournament/<int:tournament_id>/", views.tournament),
    path('user/<str:username>/', views.user),
    path('api/create-fake-user/', create_fake_user, name='create_fake_user'),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)