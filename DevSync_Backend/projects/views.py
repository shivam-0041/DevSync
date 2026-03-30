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
    ProjectMemberListSerializer,
    PendingInviteListSerializer,
    DashboardTeammateSerializer,
)

from core.models import Profile
from .models import Project, Whiteboard, Issue, ProjectTask, ProjectInvite, Branch, CodeFile, UserProjectRole
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from django.utils.timezone import now
from uuid import uuid4
from django.core.files.base import ContentFile

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
        return (Project.objects.filter(created_by=user) | Project.objects.filter(members=user)).distinct().order_by("-created_at")

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


class AllPublicProjectListView(generics.ListAPIView):
    serializer_class = ProjectListSerializer
    permission_classes = []  # No authentication required for public projects

    def get_queryset(self):
        return Project.objects.filter(visibility='public').order_by('-updated_at')

class ProjectDetailView(generics.RetrieveAPIView):
    serializer_class = ProjectDetailSerializer
    lookup_field = 'slug'
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return (Project.objects.filter(created_by=user) | Project.objects.filter(members=user)).distinct()

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_dashboard_teammates(request):
    """
    Return distinct teammates from all projects where current user is a member.
    Ordered by most recent activity.
    """
    membership_project_ids = UserProjectRole.objects.filter(user=request.user).values_list('project_id', flat=True)
    owned_project_ids = Project.objects.filter(created_by=request.user).values_list('id', flat=True)
    project_ids = set(membership_project_ids) | set(owned_project_ids)

    if not project_ids:
        return Response({'teammates': []}, status=status.HTTP_200_OK)

    teammate_roles = (
        UserProjectRole.objects
        .filter(project_id__in=project_ids)
        .exclude(user_id=request.user.id)
        .exclude(user__username__iexact=request.user.username)
        .select_related('user', 'user__profile')
        .order_by('user_id')
    )

    role_priority = {
        'admin': 4,
        'maintainer': 3,
        'developer': 2,
        'guest': 1,
    }

    teammates_by_user = {}
    current_user_id = request.user.id
    for membership in teammate_roles:
        member_user = membership.user

        if member_user.id == current_user_id:
            continue

        first_name = (member_user.first_name or '').strip()
        last_name = (member_user.last_name or '').strip()
        display_name = f"{first_name} {last_name}".strip() or member_user.username

        avatar_url = None
        profile = getattr(member_user, 'profile', None)
        avatar = getattr(profile, 'avatar', None)
        if avatar:
            try:
                avatar_name = getattr(avatar, 'name', '') or ''
                if avatar_name and 'def-avatar.svg' not in avatar_name and avatar.storage.exists(avatar_name):
                    avatar_url = request.build_absolute_uri(avatar.url)
                else:
                    avatar_url = None
            except Exception:
                avatar_url = None

        last_activity = getattr(member_user, 'last_activity', None) or getattr(member_user, 'created_at', None)
        if last_activity:
            minutes_since_active = (now() - last_activity).total_seconds() / 60
            if minutes_since_active < 5:
                status_value = 'online'
            elif minutes_since_active < 60:
                status_value = 'away'
            else:
                status_value = 'offline'
        else:
            status_value = 'offline'

        existing = teammates_by_user.get(member_user.id)
        if existing:
            current_priority = role_priority.get(membership.role, 0)
            existing_priority = role_priority.get(existing['role'], 0)
            if current_priority > existing_priority:
                existing['role'] = membership.role

            if last_activity and (not existing['last_activity'] or last_activity > existing['last_activity']):
                existing['last_activity'] = last_activity
                existing['status'] = status_value
            continue

        teammates_by_user[member_user.id] = {
            'id': member_user.id,
            'username': member_user.username,
            'display_name': display_name,
            'role': membership.role,
            'avatar': avatar_url,
            'last_activity': last_activity,
            'status': status_value,
        }

    teammates = list(teammates_by_user.values())
    teammates.sort(
        key=lambda item: (
            item['last_activity'] is None,
            -(item['last_activity'].timestamp()) if item['last_activity'] else 0,
            -role_priority.get(item['role'], 0),
            item['username'].lower(),
        )
    )

    serializer = DashboardTeammateSerializer(teammates, many=True)
    return Response({'teammates': serializer.data}, status=status.HTTP_200_OK)


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
    
    try:
        user_roles = UserProjectRole.objects.filter(project=project).select_related('user')
        members_data = ProjectMemberListSerializer(user_roles, many=True).data
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
    
    try:
        pending_invites = ProjectInvite.objects.filter(project=project, status__iexact='pending').order_by('-created_at')
        invites_data = PendingInviteListSerializer(pending_invites, many=True).data
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response({'invites': invites_data}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_pending_invite(request, slug, invite_id):
    """
    Cancel a pending invite.

    - Only project admins can cancel.
    - Invite is marked as expired.
    - Old token is invalidated so invite link can no longer be used.
    """
    from .models import UserProjectRole

    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    user_role = UserProjectRole.objects.filter(user=request.user, project=project).first()
    if not user_role or user_role.role != 'admin':
        return Response({'error': 'Only project admins can cancel invitations.'}, status=status.HTTP_403_FORBIDDEN)

    try:
        invite = ProjectInvite.objects.get(id=invite_id, project=project)
    except ProjectInvite.DoesNotExist:
        return Response({'error': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

    if str(invite.status).lower() != 'pending':
        return Response(
            {'error': f'Only pending invites can be cancelled. Current status: {invite.status}.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    invite.status = 'expired'
    invite.expires_at = now()
    invite.token = f"revoked-{uuid4().hex}"
    invite.save(update_fields=['status', 'expires_at', 'token'])

    return Response({'message': 'Invitation cancelled successfully.'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_files(request, slug):
    """
    Upload files/folders to a project.
    
    Expects multipart/form-data with:
    - files: File objects to upload
    - parent_id: (optional) Parent folder ID for nested uploads
    - branch: (optional) Branch name, defaults to 'main'
    
    Returns:
    - 201: Files uploaded successfully with file tree
    - 400: Invalid request
    - 404: Project not found
    - 403: User not authorized
    - 401: User not authenticated
    """
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is a member with upload permission
    if request.user not in project.members.all() and request.user != project.created_by:
        return Response({'error': 'You do not have permission to upload files to this project.'}, status=status.HTTP_403_FORBIDDEN)
    
    files = request.FILES.getlist('files')
    file_paths = request.POST.getlist('file_paths')
    parent_id = request.data.get('parent_id')
    branch_name = request.data.get('branch', 'main')
    
    if not files:
        return Response({'error': 'No files provided.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get or create branch
    branch, _ = Branch.objects.get_or_create(
        project=project,
        name=branch_name,
        defaults={'created_by': request.user}
    )
    
    # Get parent folder if specified
    parent_folder = None
    if parent_id:
        try:
            parent_folder = CodeFile.objects.get(id=parent_id, project=project, item_type='folder')
        except CodeFile.DoesNotExist:
            return Response({'error': 'Parent folder not found.'}, status=status.HTTP_400_BAD_REQUEST)
    
    uploaded_files = []
    
    # Process each uploaded file
    for idx, file_obj in enumerate(files):
        # Use provided path if available, otherwise fall back to filename
        file_path = file_paths[idx] if idx < len(file_paths) else file_obj.name
        # Fallback to file_obj.name if path is empty
        if not file_path:
            file_path = file_obj.name
        
        path_parts = file_path.split('/')
        
        current_parent = parent_folder
        
        # Create folder structure if needed
        for i, part in enumerate(path_parts[:-1]):
            if part:  # Skip empty parts
                folder, _ = CodeFile.objects.get_or_create(
                    project=project,
                    branch=branch,
                    parent=current_parent,
                    name=part,
                    item_type='folder',
                    defaults={'uploaded_by': request.user}
                )
                current_parent = folder
        
        # Create the file
        filename = path_parts[-1]
        code_file = CodeFile.objects.create(
            project=project,
            branch=branch,
            parent=current_parent,
            name=filename,
            item_type='file',
            file=file_obj,
            uploaded_by=request.user
        )
        uploaded_files.append(code_file)
    
    # Return updated file tree
    all_files = CodeFile.objects.filter(
        project=project,
        branch=branch,
        parent__isnull=True
    ).select_related('parent', 'uploaded_by', 'branch').prefetch_related('children').order_by('name')
    
    def serialize_file_tree(files):
        result = []
        for f in files:
            item = {
                'id': f.id,
                'name': f.name,
                'item_type': f.item_type,
                'uploaded_at': f.uploaded_at.isoformat() if f.uploaded_at else None,
                'uploaded_by': f.uploaded_by.username if f.uploaded_by else None,
                'size': f.file.size if f.file else None,
                'filetype': f.filetype,
            }
            if f.item_type == 'folder' and f.children.exists():
                item['children'] = serialize_file_tree(f.children.all())
            else:
                item['children'] = []
            result.append(item)
        return result
    
    return Response({
        'message': f'{len(uploaded_files)} file(s) uploaded successfully.',
        'files': serialize_file_tree(all_files),
        'uploaded_count': len(uploaded_files)
    }, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, slug, file_id):
    """
    Delete a file or folder from a project.
    
    Only project admins can delete files.
    
    URL parameters:
    - slug: str (project slug)
    - file_id: int (file/folder ID to delete)
    
    Request body:
    - file_name: str (required for confirmation - must match the actual file name)
    
    Returns:
    - 200: File deleted successfully with updated file tree
    - 400: Invalid request or name doesn't match
    - 403: User is not an admin
    - 404: Project or file not found
    - 401: User not authenticated
    """
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is admin
    user_role = UserProjectRole.objects.filter(user=request.user, project=project).first()
    if not user_role or user_role.role != 'admin':
        return Response({'error': 'Only project admins can delete files.'}, status=status.HTTP_403_FORBIDDEN)
    
    # Get the file
    try:
        code_file = CodeFile.objects.get(id=file_id, project=project)
    except CodeFile.DoesNotExist:
        return Response({'error': 'File not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Verify file name for confirmation
    file_name_confirmation = request.data.get('file_name', '').strip()
    if file_name_confirmation != code_file.name:
        return Response({
            'error': 'File name does not match. Deletion cancelled.',
            'expected_name': code_file.name
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # If it's a folder, delete all children recursively
    if code_file.item_type == 'folder':
        code_file.delete()  # CASCADE delete handles children
        deletion_message = f"Folder '{code_file.name}' and all contents deleted successfully."
    else:
        code_file.delete()
        deletion_message = f"File '{code_file.name}' deleted successfully."
    
    # Get updated file tree
    branch = code_file.branch
    all_files = CodeFile.objects.filter(
        project=project,
        branch=branch,
        parent__isnull=True
    ).select_related('parent', 'uploaded_by', 'branch').prefetch_related('children').order_by('name')
    
    def serialize_file_tree(files):
        result = []
        for f in files:
            item = {
                'id': f.id,
                'name': f.name,
                'item_type': f.item_type,
                'uploaded_at': f.uploaded_at.isoformat() if f.uploaded_at else None,
                'uploaded_by': f.uploaded_by.username if f.uploaded_by else None,
                'size': f.file.size if f.file else None,
                'filetype': f.filetype,
            }
            if f.item_type == 'folder' and f.children.exists():
                item['children'] = serialize_file_tree(f.children.all())
            else:
                item['children'] = []
            result.append(item)
        return result
    
    return Response({
        'message': deletion_message,
        'files': serialize_file_tree(all_files),
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_files(request, slug):
    """
    Download all project files as a ZIP archive.
    
    URL parameters:
    - slug: str (project slug)
    
    Query parameters:
    - branch: str (optional, defaults to 'main')
    
    Returns:
    - 200: ZIP file download
    - 404: Project not found
    - 401: User not authenticated
    """
    from django.http import FileResponse
    import zipfile
    import io
    
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is a member or project owner
    if request.user not in project.members.all() and request.user != project.created_by:
        return Response({'error': 'You do not have permission to download files from this project.'}, status=status.HTTP_403_FORBIDDEN)
    
    branch_name = request.query_params.get('branch', 'main')
    
    # Get all files for the project/branch
    all_files = CodeFile.objects.filter(
        project=project,
        branch__name=branch_name,
    ).select_related('parent', 'branch')
    
    # Create an in-memory ZIP file
    zip_buffer = io.BytesIO()
    
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        # Function to build folder paths for files
        def get_file_path(code_file):
            """Build the full path for a file in the archive"""
            path_parts = []
            current = code_file
            
            while current:
                path_parts.insert(0, current.name)
                current = current.parent
            
            return '/'.join(path_parts)
        
        # Add each file to the ZIP
        for file_obj in all_files:
            if file_obj.item_type == 'file' and file_obj.file:
                file_path = get_file_path(file_obj)
                zip_file.write(
                    file_obj.file.path,
                    arcname=file_path
                )
            elif file_obj.item_type == 'folder':
                # Add folder entry (empty folders)
                folder_path = get_file_path(file_obj) + '/'
                zip_file.writestr(zipfile.ZipInfo(folder_path), '')
    
    zip_buffer.seek(0)
    
    # Return ZIP file as download
    response = FileResponse(
        zip_buffer,
        content_type='application/zip',
        as_attachment=True,
        filename=f'{project.slug}-{branch_name}.zip'
    )
    
    return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_folder_contents(request, slug, folder_id):
    """
    Get the contents of a specific folder in a project.
    
    URL parameters:
    - slug: str (project slug)
    - folder_id: int (folder ID)
    
    Returns:
    - 200: Folder contents with nested structure
    - 404: Folder or project not found
    - 401: User not authenticated
    """
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Check if user is a member or project owner
    if request.user not in project.members.all() and request.user != project.created_by:
        return Response({'error': 'You do not have permission to access this project.'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        folder = CodeFile.objects.get(id=folder_id, project=project, item_type='folder')
    except CodeFile.DoesNotExist:
        return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Get children of the folder
    children = CodeFile.objects.filter(parent=folder, project=project).select_related('parent', 'uploaded_by').prefetch_related('children').order_by('name')
    
    def serialize_file_tree(files):
        result = []
        for f in files:
            item = {
                'id': f.id,
                'name': f.name,
                'item_type': f.item_type,
                'uploaded_at': f.uploaded_at.isoformat() if f.uploaded_at else None,
                'uploaded_by': f.uploaded_by.username if f.uploaded_by else None,
                'size': f.file.size if f.file else None,
                'filetype': f.filetype,
            }
            if f.item_type == 'folder' and f.children.exists():
                item['children'] = serialize_file_tree(f.children.all())
            else:
                item['children'] = []
            result.append(item)
        return result
    
    return Response({
        'id': folder.id,
        'name': folder.name,
        'item_type': folder.item_type,
        'children': serialize_file_tree(children)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_project_item(request, slug):
    """
    Create a file or folder inside a project.

    Request body:
    - name: str (required)
    - item_type: 'file' | 'folder' (required)
    - parent_id: int | null (optional)
    - branch: str (optional, defaults to main)
    - initial_content: str (optional, for file)
    """
    try:
        project = Project.objects.get(slug=slug)
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.user not in project.members.all() and request.user != project.created_by:
        return Response({'error': 'You do not have permission to modify this project.'}, status=status.HTTP_403_FORBIDDEN)

    name = str(request.data.get('name', '')).strip()
    item_type = str(request.data.get('item_type', '')).strip().lower()
    parent_id = request.data.get('parent_id')
    branch_name = str(request.data.get('branch', 'main')).strip() or 'main'
    initial_content = request.data.get('initial_content', '')

    if not name:
        return Response({'error': 'Name is required.'}, status=status.HTTP_400_BAD_REQUEST)

    if item_type not in [CodeFile.FILE, CodeFile.FOLDER]:
        return Response({'error': 'item_type must be file or folder.'}, status=status.HTTP_400_BAD_REQUEST)

    branch, _ = Branch.objects.get_or_create(
        project=project,
        name=branch_name,
        defaults={'created_by': request.user}
    )

    parent = None
    if parent_id not in [None, '', 'null']:
        try:
            parent = CodeFile.objects.get(id=parent_id, project=project, item_type=CodeFile.FOLDER)
        except CodeFile.DoesNotExist:
            return Response({'error': 'Parent folder not found.'}, status=status.HTTP_400_BAD_REQUEST)

    already_exists = CodeFile.objects.filter(
        project=project,
        branch=branch,
        parent=parent,
        name=name,
        item_type=item_type,
    ).exists()
    if already_exists:
        return Response({'error': f'{item_type.title()} with the same name already exists in this location.'}, status=status.HTTP_400_BAD_REQUEST)

    item = CodeFile(
        project=project,
        branch=branch,
        parent=parent,
        name=name,
        item_type=item_type,
        uploaded_by=request.user,
    )

    if item_type == CodeFile.FILE:
        content_value = '' if initial_content is None else str(initial_content)
        item.file.save(name, ContentFile(content_value.encode('utf-8')), save=False)

    item.save()

    return Response(
        {
            'message': f'{item_type.title()} created successfully.',
            'item': {
                'id': item.id,
                'name': item.name,
                'item_type': item.item_type,
                'parent_id': item.parent_id,
                'branch': item.branch.name if item.branch else None,
            }
        },
        status=status.HTTP_201_CREATED,
    )
