"""
ASGI config for ftt project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application
from channels.sessions import SessionMiddlewareStack


from django.urls import re_path

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

from pong import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ftt.settings')
application = ProtocolTypeRouter({
	"http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r'game/(?P<game_id>\d+)/ws/$', consumers.PlayerConsumer.as_asgi()),
				# path("game/<int:game_id>/ws", consumers.PlayerConsumer.as_asgi()),
            ])
        )
    ),

})
