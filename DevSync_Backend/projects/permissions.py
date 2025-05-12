from rest_framework.permissions import BasePermission
from .models import UserProjectRole, Project

class IsOwnerOrCollaborator(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Direct Project check
        if isinstance(obj, Project):
            return self._check_access(request.user, obj)
        
        # Related to a Project via 'project' or 'repository' field
        project = getattr(obj, 'project', None) or getattr(obj, 'repository', None)
        if isinstance(project, Project):
            return self._check_access(request.user, project)
        
        return False

    def _check_access(self, user, project):
        if project.owner == user:
            return True
        return UserProjectRole.objects.filter(user=user, project=project, role='collaborator').exists()
