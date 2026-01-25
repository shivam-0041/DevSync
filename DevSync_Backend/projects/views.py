from rest_framework import generics, permissions
from .serializers import (
    ProjectCreateSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    IssueCreateSerializer,
    #ProjectTaskListSerializer,
    ProjectTaskCreateSerializer,
    WhiteboardSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Project, Whiteboard, Issue, ProjectTask
from django.contrib.auth import get_user_model

User = get_user_model()
class CreateProjectView(generics.CreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class ProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(created_by=user) | Project.objects.filter(members=user)

class PublicProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = []  # No authentication required for public projects

    def get_queryset(self):
        username = self.kwargs.get('username')
        if username:
            try:
                user = User.objects.get(username=username)
                return Project.objects.filter(created_by=user, visibility='public')
            except User.DoesNotExist:
                return Project.objects.none()
        return Project.objects.none()

class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(created_by=user) | Project.objects.filter(members=user)

class ProjectUpdateView(generics.UpdateAPIView):
    serializer_class = ProjectCreateSerializer  # reuse same as creation
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(created_by=self.request.user)

class ProjectDeleteView(generics.DestroyAPIView):
    lookup_field = 'project_id'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(created_by=self.request.user)

@api_view(['GET'])
def get_whiteboard(request, slug, whiteboard_code):
    project = get_object_or_404(Project, slug=slug, whiteboard_id=whiteboard_code)
    whiteboard, _ = Whiteboard.objects.get_or_create(repository=project)
    serializer = WhiteboardSerializer(whiteboard)
    return Response(serializer.data)


@api_view(['PUT'])
def update_whiteboard(request, slug, whiteboard_code):
    project = get_object_or_404(Project, slug=slug, whiteboard_id=whiteboard_code)
    whiteboard, _ = Whiteboard.objects.get_or_create(repository=project)
    serializer = WhiteboardSerializer(whiteboard, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class IssueCreateView(generics.CreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        slug = self.kwargs.get("slug")
        project = get_object_or_404(Project, slug=slug)
        serializer.save(project=project,created_by=self.request.user)


class TasksCreateView(generics.CreateAPIView):
    queryset = ProjectTask.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        project = get_object_or_404(Project, slug=slug)
        serializer = ProjectTaskCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(project=project)  # attach project here
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import MyAssignedTaskSerializer

class MyAssignedTasksView(ListAPIView):
    serializer_class = MyAssignedTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            ProjectTask.objects
            .filter(assign_to=self.request.user)
            .exclude(status="done")          # optional: hide completed
            .select_related("assign_to", "project")
            .order_by("deadline")
        )
