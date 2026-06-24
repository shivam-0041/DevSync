# REST endpoint for fetching chat history for a given project's session

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from projects.models import Project
from .models import ChatMessage, ChatSession
from .serializers import ChatMessageSerializer


class ChatHistoryView(generics.ListAPIView):
    """
    GET /api/chats/<slug>/messages/

    Returns all chat messages for the project identified by <slug>.
    Only project owners and members can access this.

    Security:
      - IsAuthenticated ensures only logged-in users reach this view.
      - The queryset itself re-checks that the requesting user is the owner
        or a member of the project (defence in depth).
    """
    serializer_class = ChatMessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        project = get_object_or_404(Project, slug=slug)

        # Double check: user must be owner or a member
        is_owner = project.created_by == self.request.user
        is_member = project.members.filter(id=self.request.user.id).exists()

        if not is_owner and not is_member:
            raise PermissionDenied("You do not have access to this project's chat.")

        # Get or create the session for this project
        session, _ = ChatSession.objects.get_or_create(repository=project)

        return ChatMessage.objects.filter(session=session).order_by('timestamp')

    def get_serializer_context(self):
        # Pass request context so avatar URLs are built as absolute URIs
        context = super().get_serializer_context()
        context['request'] = self.request
        return context