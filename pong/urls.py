from django.views.generic.base import RedirectView
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views
from .views import create_fake_user

urlpatterns = [
    path("", views.home, name="home"),
    path("", views.index),
    path("favicon.ico", RedirectView.as_view(url=static("favicon.ico"))),
    path("accounts/login/", views.loginview),
    path("accounts/callback/", views.callback),
    path("accounts/logout/", views.logoutview),
    path("accounts/profil/", views.profil),
    path("accounts/profil/picture/", views.profilPicture),
    # path("accounts/profil/nickname/<str:nickname>/", views.nickname),
    path("accounts/profil/nickname/", views.nickname),
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
    path("tournament/<int:tournamentId>/next/", views.tournament_next),
    path("tournament/game/<int:gameId>/", views.tournament_game),
    path("user/<str:nickname>/", views.user),
    path("api/create-fake-user/", create_fake_user, name="create_fake_user"),
    path("accounts/profil/settings/", views.UpdateUserSettingsView),
    path("accounts/profil/settings/data/", views.getUserData),
    path("users/list", views.get_users),
    path("game/<int:gameId>/get-nickname/", views.get_nicknames),
    path("tournament/<int:gameId>/get-nickname/", views.get_nicknames),
    path("game/<int:gameId>/get-scores/", views.get_scores),
    path("accounts/profil/", views.profil_view, name="profil_view"),
    path("<path:prefix>/getList/<str:type>", views.getList),
    path("chat/conversations/", views.get_user_conversations),
    path("<path:prefix>/manageFriend/<str:action>/<str:nickname>/", views.manageFriend),
    path(
        "<path:prefix>/manageFriendChat/<str:action>/<str:username>/",
        views.manageFriendChat,
    ),
    path("update-status/", views.update_status, name="update_status"),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
