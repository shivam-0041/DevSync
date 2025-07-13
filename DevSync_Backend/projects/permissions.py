from rest_framework.permissions import BasePermission
from .models import UserProjectRole, Project

class IsOwnerOrCollaborator(BasePermission):
    def has_object_permission(self, request, view, obj):
        # If obj is directly a Project instance
        if isinstance(obj, Project):
            return self._check_access(request.user, obj)

        # Try to get the related project from obj
        project = getattr(obj, 'project', None) or getattr(obj, 'repository', None)
        if isinstance(project, Project):
            return self._check_access(request.user, project)

        return False

    def _check_access(self, user, project):
        # Check if user is the creator/owner
        if project.created_by == user:
            return True
        
        # Check if user is a collaborator
        return UserProjectRole.objects.filter(
            user=user,
            project=project,
            role='collaborator'
        ).exists()
