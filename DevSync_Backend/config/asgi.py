"""
ASGI config for DevSync.

HTTP traffic → standard Django ASGI app
WebSocket traffic → JWTAuthMiddleware → URLRouter → ChatConsumer

Security flow for WebSocket connections:
  1. Client sends: ws://host/ws/chat/<session_id>/?token=<JWT>
  2. JWTAuthMiddleware extracts the token from the query string
  3. It verifies the JWT signature using SECRET_KEY (via SimpleJWT's AccessToken)
  4. If valid → scope["user"] = the authenticated user object
  5. If invalid/missing → scope["user"] = AnonymousUser
  6. ChatConsumer.connect() checks is_anonymous and closes the socket if unauthorized
  In production, use wss:// (TLS) so the token in the URL is encrypted in transit.
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from chats.middleware import JWTAuthMiddleware
from chats.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    # All regular HTTP requests → standard Django request/response
    "http": get_asgi_application(),

    # All WebSocket upgrade requests → origin validated → authenticated via JWT → routed to ChatConsumer
    "websocket": AllowedHostsOriginValidator(
        JWTAuthMiddleware(
            URLRouter(
                websocket_urlpatterns
            )
        )
    ),
})