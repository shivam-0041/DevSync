from rest_framework import generics, permissions
from .serializers import (
    ProjectCreateSerializer,
    ProjectListSerializer,
    ProjectDetailSerializer,
    IssueCreateSerializer,
    #ProjectTaskListSerializer,
    ProjectTaskCreateSerializer,
    WhiteboardSerializer,
    ProjectInviteSerializer,
)
from .models import Project, Whiteboard, Issue, ProjectTask, ProjectInvite
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
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


# ============================
# Project Invite Views
# ============================

@api_view(['POST'])
def send_project_invite(request, slug):
    """
    Send a project invitation to an email address.
    
    Required fields in request body:
    - email: str (email address of invitee)
    - role: str (admin, maintainer, developer, guest)
    
    Returns:
    - 201: Invitation sent successfully
    - 400: Validation error
    - 403: Permission denied (not admin)
    - 404: Project not found
    """
    from .utils import ProjectInviteService
    
    if request.method != 'POST':
        return Response(
            {'error': 'Only POST requests are allowed'},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
    
    # Debug: print what frontend is sending
    print(f"DEBUG request.data: {request.data}")
    print(f"DEBUG slug from URL: {slug}")
    
    # Use serializer to validate and create
    data = {
        'project_slug': slug,
        'email': request.data.get('email'),
        'role_to_assign': request.data.get('role'),
    }
    
    print(f"DEBUG data passed to serializer: {data}")

    serializer = ProjectInviteSerializer(data=data, context={'request': request})
    is_valid = serializer.is_valid()
    print(f"DEBUG serializer.is_valid(): {is_valid}")
    print(f"DEBUG serializer.errors: {serializer.errors}")
    
    if not is_valid:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    invite = serializer.save()
    return Response(
        {
            'message': f'Invitation sent to {invite.email}',
            'invite_token': invite.token,
            'expires_at': invite.expires_at
        },
        status=status.HTTP_201_CREATED
    )


@api_view(['POST'])
def respond_to_invite(request):
    """
    Handle user's response to a project invitation.
    
    Query parameters:
    - token: str (secure token from invite link)
    - action: str ('accept' or 'decline')
    
    Returns:
    - 200: Action completed successfully
    - 400: Invalid token or expired
    - 401: User not authenticated
    """
    from .utils import ProjectInviteResponseService
    
    if not request.user.is_authenticated:
        return Response(
            {'error': 'Authentication required'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token = request.query_params.get('token')
    action = request.query_params.get('action')

    if not token or not action:
        return Response(
            {'error': 'token and action query parameters are required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # fetch invite instance or return 404
    try:
        invite = ProjectInvite.objects.get(token=token)
    except ProjectInvite.DoesNotExist:
        return Response({'error': 'Invalid invitation token.'}, status=status.HTTP_400_BAD_REQUEST)

    # build serializer for update
    serializer = ProjectInviteSerializer(
        invite,
        data={'action': action},
        partial=True,
        context={'request': request}
    )
    try:
        serializer.is_valid(raise_exception=True)
        serializer.save()
    except Exception as exc:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # after saving we can inspect status on invite
    response_data = {'message': invite.__class__.objects.get(pk=invite.pk).status}
    # Instead simply reconstruct as previous logic:
    if invite.status == 'accepted':
        response_data = {
            'message': f'You have accepted the invitation to {invite.project.name}.',
            'project': {
                'id': invite.project.id,
                'name': invite.project.name,
                'slug': invite.project.slug
            }
        }
    else:
        response_data = {
            'message': f'You have declined the invitation to {invite.project.name}.'
        }

    return Response(response_data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_project_members(request, slug):
    """
    Fetch all members of a project.
    
    URL parameters:
    - slug: str (project slug)
    
    Returns:
    - 200: List of project members with user details
    - 404: Project not found
    - 401: User not authenticated
    """
    from .models import UserProjectRole
    
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get all members via UserProjectRole
    members_data = []
    try:
        user_roles = UserProjectRole.objects.filter(project=project)
        for user_role in user_roles:
            # Safely handle avatar URL
            avatar_url = None
            try:
                if hasattr(user_role.user, 'profile') and user_role.user.profile and user_role.user.profile.avatar:
                    avatar_url = user_role.user.profile.avatar.url
            except Exception as e:
                print(f"Error getting avatar URL: {e}")
            
            members_data.append({
                'id': user_role.id,
                'user': {
                    'username': user_role.user.username,
                    'email': user_role.user.email,
                    'first_name': user_role.user.first_name or '',
                    'last_name': user_role.user.last_name or '',
                    'profile': {
                        'avatar': avatar_url
                    }
                },
                'role': user_role.role,
                'created_at': user_role.created_at
            })
    except Exception as e:
        print(f"Error fetching members: {e}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'members': members_data}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_pending_invites(request, slug):
    """
    Fetch pending invitations for a project.
    
    URL parameters:
    - slug: str (project slug)
    
    Returns:
    - 200: List of pending project invitations
    - 404: Project not found
    - 401: User not authenticated
    """
    
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get all pending invites for this project
    invites_data = []
    try:
        pending_invites = ProjectInvite.objects.filter(project=project, status='pending')
        for invite in pending_invites:
            invites_data.append({
                'id': invite.id,
                'email': invite.email,
                'role_to_assign': invite.role_to_assign,
                'status': invite.status,
                'created_at': invite.created_at,
                'expires_at': invite.expires_at
            })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'invites': invites_data}, status=status.HTTP_200_OK)
