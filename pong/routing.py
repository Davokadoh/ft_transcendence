from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'game/(?P<game_id>\d+)/ws/$', consumers.Consumer.as_asgi()),
    # re_path(r"ws/chat/conversation/$", consumers.ChatConsumer.as_asgi()),
]
