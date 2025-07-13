from rest_framework import generics, permissions
from .models import Project
from .serializers import (
    ProjectCreateSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer
)
from rest_framework.permissions import IsAuthenticated

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

class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    lookup_field = 'project_id'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(created_by=user) | Project.objects.filter(members=user)

class ProjectUpdateView(generics.UpdateAPIView):
    serializer_class = ProjectCreateSerializer  # reuse same as creation
    lookup_field = 'project_id'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(created_by=self.request.user)

class ProjectDeleteView(generics.DestroyAPIView):
    lookup_field = 'project_id'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.filter(created_by=self.request.user)
