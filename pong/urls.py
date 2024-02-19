from django.views.generic.base import RedirectView
from django.conf.urls.static import static
from django.conf import settings
from django.urls import path
from . import views

urlpatterns = [
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
    # path("lobby_tour/", views.lobby_tour),
    # path("lobby_tour/<int:tournament_id>/", views.lobby_tour),
    # path("tournament/<int:tournament_id>/", views.tournament),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
