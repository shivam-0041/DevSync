# HTTP URL routing for the chats app (REST endpoints only)
# WebSocket routes are in routing.py

from django.urls import path
from .views import ChatHistoryView

urlpatterns = [
    # GET /api/chats/<slug>/messages/ → chat history for a project
    path('<slug:slug>/messages/', ChatHistoryView.as_view(), name='chat-history'),
]