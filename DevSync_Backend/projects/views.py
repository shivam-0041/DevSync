
'''from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Chat, Whiteboard, Project, has_access
from .serializers import ChatSerializer, WhiteboardSerializer, ProjectSerializer
from .permissions import IsOwnerOrCollaborator

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ChatViewSet(viewsets.ModelViewSet):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]

    def get_queryset(self):
        return Chat.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('repository')
        repository = Project.objects.get(id=project_id)
        if has_access(self.request.user, repository):
            chat = serializer.save(repository=repository)
            chat.participants.add(self.request.user)
        else:
            raise PermissionDenied("You don't have access to this chat")

class WhiteboardViewSet(viewsets.ModelViewSet):
    queryset = Whiteboard.objects.all()
    serializer_class = WhiteboardSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrCollaborator]

    def get_queryset(self):
        return Whiteboard.objects.filter(repository__userprojectrole__user=self.request.user)

    def perform_create(self, serializer):
        project_id = self.request.data.get('repository')
        repository = Project.objects.get(id=project_id)
        if has_access(self.request.user, repository):
            serializer.save(repository=repository)
        else:
            raise PermissionDenied("You don't have access to this whiteboard")

'''