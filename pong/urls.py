from django.views.generic.base import RedirectView
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views
from .views import create_fake_user

urlpatterns = [
    path('', views.home, name='home'),
    path("", views.index),
    path("favicon.ico", RedirectView.as_view(url=static("favicon.ico"))),
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
    path("lobby/<int:gameId>/", views.lobby),
    path("game/<int:gameId>/", views.game),
	path("remLobby/", views.remLobby),
    path("remLobby/<int:remoteId>/", views.remLobby),
    path("remote/<int:remoteId>/", views.remote),
	path("tourLobby/", views.tourLobby),
    path("tourLobby/<int:tournamentId>/", views.tourLobby),
    path("tournament/<int:tournamentId>/", views.tournament),
    path('user/<str:username>/', views.user),
    path('api/create-fake-user/', create_fake_user, name='create_fake_user'),
    path("users/list", views.get_users),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
