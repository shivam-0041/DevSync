from rest_framework import serializers
from .models import Project, CodeFile, Branch, ProjectActivity, Issue, Whiteboard, ProjectTask, ProjectInvite, UserProjectRole, DiscussionThread, DiscussionComment, PullRequest
from django.contrib.auth import get_user_model
from .utils import ProjectInviteService, ProjectInviteResponseService
from django.db import models
from django.utils.timezone import now

User = get_user_model()


class ProjectCreateSerializer(serializers.ModelSerializer):
    readme = serializers.BooleanField(write_only=True, default=False)
    class Meta:
        model = Project
        fields = [
            'name', 'description', 'visibility','template' ,'gitignore', 'license',
            'readme', 'issues_enabled', 'wiki_enabled', 'boards_enabled',
            'discussions_enabled', 'auto_init','logo',
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        create_readme = validated_data.pop('readme', False)
        validated_data.pop('created_by', None)
        project = Project.objects.create(created_by=user, **validated_data)

        if create_readme:
            default_branch = project.branches.filter(is_default=True).first()
            CodeFile.objects.create(
                project=project,
                branch=default_branch,
                name="README.md",
                item_type=CodeFile.FILE,
                uploaded_by=user,
                filetype="md"
            )
        # Create UserProjectRole for creator with admin role
        UserProjectRole.objects.create(user=user, project=project, role='admin')
        return project

class ProjectListSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()
    branches = serializers.IntegerField(source='branches_count', read_only=True)
    comments = serializers.IntegerField(source='discussion_count', read_only=True)
    is_starred = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'

    def get_is_starred(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.starred_by.filter(pk=request.user.pk).exists()
        return False



class ProjectDetailSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    branches = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    contributors = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    issues = serializers.SerializerMethodField()
    tasks = serializers.SerializerMethodField()
    pull_requests = serializers.SerializerMethodField()
    discussions = serializers.SerializerMethodField()
    commit_count = serializers.IntegerField(source='commits_count', read_only=True)
    branch_count = serializers.IntegerField(source='branches_count', read_only=True)
    issues_count = serializers.IntegerField(source='issue_count', read_only=True)
    pull_requests_count = serializers.IntegerField(source='open_pull_request_count', read_only=True)
    is_starred = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "visibility",
            "created_by",
            "branches",
            "files",
            "activities",
            "contributors",
            "tasks",
            "issues",
            "pull_requests",
            "discussions",
            "readme",
            "commit_count",
            "branch_count",
            "issues_count",
            "pull_requests_count",
            "updated_at",
            "whiteboard_id",
            "chat_id",
            "slug",
            "members",
            "stars",
            "is_starred",
        ]

    def get_is_starred(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.starred_by.filter(pk=request.user.pk).exists()
        return False

    # --- Custom field methods ---
    def get_created_by(self, obj):
        if obj.created_by:
            return {
                "id": obj.created_by.id,
                "username": obj.created_by.username,
                "email": obj.created_by.email,
            }
        return None

    def get_branches(self, obj):
        return [
            {
                "id": branch.id,
                "name": branch.name,
                "created_at": branch.created_at,
                "is_default": branch.is_default,
            }
            for branch in obj.branches.all()
        ]

    def get_files(self, obj):
        """
        Return project code files as a nested tree for frontend rendering.
        Each folder includes its children recursively.
        """
        code_files = obj.files.select_related("parent", "uploaded_by", "branch").all().order_by("name")

        file_map = {}
        roots = []

        for code_file in code_files:
            file_url = None
            file_size = None
            if code_file.file:
                try:
                    file_url = code_file.file.url
                except Exception:
                    file_url = None
                try:
                    file_size = code_file.file.size
                except Exception:
                    file_size = None

            file_map[code_file.id] = {
                "id": code_file.id,
                "name": code_file.name,
                "item_type": code_file.item_type,
                "filetype": code_file.filetype,
                "file_url": file_url,
                "size": file_size,
                "uploaded_at": code_file.uploaded_at,
                "uploaded_by": code_file.uploaded_by.username if code_file.uploaded_by else None,
                "branch": code_file.branch.name if code_file.branch else None,
                "children": [],
            }

        for code_file in code_files:
            current = file_map[code_file.id]
            if code_file.parent_id and code_file.parent_id in file_map:
                file_map[code_file.parent_id]["children"].append(current)
            else:
                roots.append(current)

        return roots

    def get_activities(self, obj):
        return [
            {
                "id": act.id,
                "user": {
                    "id": act.user.id if act.user else None,
                    "username": act.user.username if act.user else None,
                    "email": act.user.email if act.user else None,
                },
                "action": act.action,
                "timestamp": act.timestamp,
                "extra_data": act.extra_data,
            }
            for act in obj.activities.all().order_by("-timestamp")[:20]  # latest 20
        ]

    def get_contributors(self, obj):
        users = User.objects.filter(projectactivity__project=obj).distinct()
        return [
            {"id": u.id, "username": u.username, "email": u.email}
            for u in users
        ]

    def get_members(self, obj):
        # Return project members with their role
        memberships = obj.userprojectrole_set.select_related('user').all()
        return [
            {
                "id": m.user.id,
                "username": m.user.username,
                "email": m.user.email,
                "role": m.role,
            }
            for m in memberships
        ]

    def get_readme(self, obj):
        readme_file = obj.files.filter(name__iexact="README.md").first()
        if readme_file and readme_file.file:
            try:
                return readme_file.file.read().decode("utf-8")
            except Exception:
                return ""
        return None

    def get_commit_count(self, obj):
        return obj.activities.filter(action__icontains="commit").count()
    
    def get_issues(self, obj):
        from .serializers import ProjectIssueSerializer  
        issues = obj.issues_list.all().order_by("-created_at")[:50]  
        return ProjectIssueSerializer(issues, many=True).data
    
    def get_tasks(self, obj):
        return [
            {
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "priority": task.priority,
                "status": task.status if hasattr(task, "status") else None,
                "deadline": task.deadline,
                "assign_to": task.assign_to.username if task.assign_to else None,
                "labels": task.labels,
                "dependencies": task.dependencies,
            }
            for task in obj.tasks.all()
        ]

    def get_pull_requests(self, obj):
        return [
            {
                "id": pr.id,
                "from_branch": pr.from_branch.name if pr.from_branch else None,
                "to_branch": pr.to_branch.name if pr.to_branch else None,
                "created_by": pr.created_by.username if pr.created_by else None,
                "message": pr.message,
                "status": pr.status,
                "created_at": pr.created_at,
            }
            for pr in obj.pull_requests.select_related("from_branch", "to_branch", "created_by").all().order_by("-created_at")
        ]

    def get_discussions(self, obj):
        return [
            {
                "id": thread.id,
                "thread_id": thread.thread_id,
                "title": thread.title,
                "thread_type": thread.thread_type,
                "created_by": thread.created_by.username if thread.created_by else None,
                "created_at": thread.created_at,
                "comment_count": thread.comment_count,
                "is_closed": thread.is_closed,
                "last_activity": thread.last_activity,
            }
            for thread in obj.threads.select_related("created_by").all().order_by("-last_activity")
        ]

    

# ============================
# Public (unauthenticated) Project Detail Serializer
# Omits sensitive fields: chat_id, whiteboard_id, tasks, member roles
# Discussions and issues are included read-only
# ============================

class PublicProjectDetailSerializer(serializers.ModelSerializer):
    created_by = serializers.SerializerMethodField()
    branches = serializers.SerializerMethodField()
    files = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    contributors = serializers.SerializerMethodField()
    issues = serializers.SerializerMethodField()
    pull_requests = serializers.SerializerMethodField()
    discussions = serializers.SerializerMethodField()
    commit_count = serializers.IntegerField(source='commits_count', read_only=True)
    branch_count = serializers.IntegerField(source='branches_count', read_only=True)
    issues_count = serializers.IntegerField(source='issue_count', read_only=True)
    pull_requests_count = serializers.IntegerField(source='open_pull_request_count', read_only=True)
    is_starred = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "visibility",
            "slug",
            "logo",
            "created_by",
            "branches",
            "files",
            "activities",
            "contributors",
            "issues",
            "pull_requests",
            "discussions",
            "readme",
            "commit_count",
            "branch_count",
            "issues_count",
            "pull_requests_count",
            "updated_at",
            "created_at",
            "stars",
            "is_starred",
            "languages",
            "license",
        ]

    def get_is_starred(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            return obj.starred_by.filter(pk=request.user.pk).exists()
        return False

    def get_created_by(self, obj):
        if not obj.created_by:
            return None
        profile = getattr(obj.created_by, 'profile', None)
        avatar_url = None
        avatar = getattr(profile, 'avatar', None)
        if avatar:
            try:
                request = self.context.get('request')
                avatar_name = getattr(avatar, 'name', '') or ''
                if avatar_name and 'def-avatar.svg' not in avatar_name:
                    avatar_url = request.build_absolute_uri(avatar.url) if request else avatar.url
            except Exception:
                avatar_url = None
        return {
            "id": obj.created_by.id,
            "username": obj.created_by.username,
            "avatar": avatar_url,
        }

    def get_branches(self, obj):
        return [
            {
                "id": branch.id,
                "name": branch.name,
                "created_at": branch.created_at,
                "is_default": branch.is_default,
            }
            for branch in obj.branches.all()
        ]

    def get_files(self, obj):
        code_files = obj.files.select_related("parent", "uploaded_by", "branch").all().order_by("name")
        file_map = {}
        roots = []
        for code_file in code_files:
            file_url = None
            file_size = None
            if code_file.file:
                try:
                    file_url = code_file.file.url
                except Exception:
                    file_url = None
                try:
                    file_size = code_file.file.size
                except Exception:
                    file_size = None
            file_map[code_file.id] = {
                "id": code_file.id,
                "name": code_file.name,
                "item_type": code_file.item_type,
                "filetype": code_file.filetype,
                "file_url": file_url,
                "size": file_size,
                "uploaded_at": code_file.uploaded_at,
                "uploaded_by": code_file.uploaded_by.username if code_file.uploaded_by else None,
                "branch": code_file.branch.name if code_file.branch else None,
                "children": [],
            }
        for code_file in code_files:
            current = file_map[code_file.id]
            if code_file.parent_id and code_file.parent_id in file_map:
                file_map[code_file.parent_id]["children"].append(current)
            else:
                roots.append(current)
        return roots

    def get_activities(self, obj):
        return [
            {
                "id": act.id,
                "user": {
                    "id": act.user.id if act.user else None,
                    "username": act.user.username if act.user else None,
                },
                "action": act.action,
                "timestamp": act.timestamp,
            }
            for act in obj.activities.all().order_by("-timestamp")[:20]
        ]

    def get_contributors(self, obj):
        from django.contrib.auth import get_user_model
        UserModel = get_user_model()
        users = UserModel.objects.filter(projectactivity__project=obj).distinct()
        result = []
        for u in users:
            profile = getattr(u, 'profile', None)
            avatar_url = None
            avatar = getattr(profile, 'avatar', None)
            if avatar:
                try:
                    request = self.context.get('request')
                    avatar_url = request.build_absolute_uri(avatar.url) if request else avatar.url
                except Exception:
                    avatar_url = None
            result.append({
                "id": u.id,
                "username": u.username,
                "avatar": avatar_url,
            })
        return result

    def get_issues(self, obj):
        issues = obj.issues_list.all().order_by("-created_at")[:50]
        return [
            {
                "id": issue.id,
                "title": issue.title,
                "status": issue.status,
                "issue_type": issue.issue_type,
                "priority": issue.priority,
                "labels": issue.labels,
                "created_by_username": issue.created_by.username if issue.created_by else None,
                "assigned_to_username": issue.assigned_to.username if issue.assigned_to else None,
                "created_at": issue.created_at,
                "updated_at": issue.updated_at,
            }
            for issue in issues
        ]

    def get_pull_requests(self, obj):
        return [
            {
                "id": pr.id,
                "from_branch": pr.from_branch.name if pr.from_branch else None,
                "to_branch": pr.to_branch.name if pr.to_branch else None,
                "created_by": pr.created_by.username if pr.created_by else None,
                "message": pr.message,
                "status": pr.status,
                "is_draft": pr.is_draft,
                "created_at": pr.created_at,
            }
            for pr in obj.pull_requests.select_related("from_branch", "to_branch", "created_by").all().order_by("-created_at")
        ]

    def get_discussions(self, obj):
        return [
            {
                "id": thread.id,
                "thread_id": thread.thread_id,
                "title": thread.title,
                "thread_type": thread.thread_type,
                "created_by": thread.created_by.username if thread.created_by else None,
                "created_at": thread.created_at,
                "comment_count": thread.comment_count,
                "is_closed": thread.is_closed,
                "last_activity": thread.last_activity,
                "labels": thread.labels,
            }
            for thread in obj.threads.select_related("created_by").all().order_by("-last_activity")
        ]


class WhiteboardSerializer(serializers.ModelSerializer):
    last_modified_by = serializers.CharField(
        source='last_modified_by.username',
        read_only=True
    )

    class Meta:
        model = Whiteboard
        fields = [
            'id',
            'data',
            'updated_at',
            'last_modified_by'
        ]


class IssueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            "id",
            "title",
            "description",
            "status",
            "created_by",
            "assigned_to",
            "created_at",
            "updated_at",
            "issue_type",
            "priority",
            "labels",
        ]
        #read_only_fields = ["project", "title", "status", "issue_type", "created_by", "created_at", "updated_at"]

class ProjectIssueSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source="created_by.username", read_only=True)
    assigned_to_username = serializers.CharField(source="assigned_to.username", read_only=True)

    class Meta:
        model = Issue
        fields = [
            "id",
            "title",
            "description",
            "status",
            "issue_type",
            "priority",
            "labels",
            "created_by_username",
            "assigned_to_username",
            "created_at",
            "updated_at",
        ]

class ProjectTaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTask
        fields = [
            "id", "task_id", "title", "description",
            "assign_to", "priority", "status", "deadline",
            "labels", "dependencies"
        ]
        read_only_fields = ["id", "task_id"]

class ProjectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__" 
        read_only_fields = ("project_id", "created_at", "updated_at", "slug")


class MyAssignedTaskSerializer(serializers.ModelSerializer):
    assignee = serializers.SerializerMethodField()
    dueDate = serializers.DateField(source="deadline")
    project_name = serializers.CharField(source="project.name")

    class Meta:
        model = ProjectTask
        fields = [
            "task_id",
            "title",
            "status",
            "priority",
            "assignee",
            "dueDate",
            "project_name",
        ]

    def get_assignee(self, obj):
        if not obj.assign_to:
            return None

        user = obj.assign_to
        name = user.name = user.full_name or user.username

        return {
            "name": name,
            "avatar": None,  # plug later if you add avatars
            "initials": "".join([part[0] for part in name.split()[:2]]).upper(),
        }


class ProjectMemberListSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = UserProjectRole
        fields = ["id", "user", "role", "created_at"]

    def get_user(self, obj):
        avatar_url = None
        profile = getattr(obj.user, "profile", None)
        avatar = getattr(profile, "avatar", None)
        if avatar:
            try:
                avatar_url = avatar.url
            except Exception:
                avatar_url = None

        return {
            "username": obj.user.username,
            "email": obj.user.email,
            "first_name": obj.user.first_name or "",
            "last_name": obj.user.last_name or "",
            "profile": {
                "avatar": avatar_url
            },
        }

    def get_created_at(self, obj):
        # Fallback keeps frontend joined-date rendering stable even if membership timestamp is absent.
        return getattr(obj, "created_at", None) or getattr(obj.user, "date_joined", None)


class DashboardTeammateSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    display_name = serializers.CharField()
    role = serializers.CharField()
    avatar = serializers.CharField(allow_blank=True, allow_null=True)
    last_activity = serializers.DateTimeField(allow_null=True)
    status = serializers.ChoiceField(choices=["online", "away", "offline"])


class PendingInviteListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInvite
        fields = ["id", "email", "role_to_assign", "status", "created_at", "expires_at"]
    

# This serializer wraps the invitation flow.  It uses the service layer
# already defined in utils to handle sending emails and processing responses.
# The frontend will POST to create and PATCH/PUT to respond.
class ProjectInviteSerializer(serializers.ModelSerializer):
    # allow frontend to submit an action when responding to an invite
    action = serializers.CharField(write_only=True, required=False)
    project_slug = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    role_to_assign = serializers.CharField(required=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        model = ProjectInvite
        fields = [
            'id', 'email', 'role_to_assign', 'status',
            'token', 'expires_at', 'invited_by', 'created_at', 'action', 'project_slug',
        ]
        read_only_fields = [
            'id', 'status', 'token', 'expires_at', 'invited_by', 'created_at'
        ]

    def validate_project_slug(self, value):
        # Validate and lookup project slug for create operations
        if not value:
            raise serializers.ValidationError('Project slug is required.')
        try:
            project = Project.objects.get(slug=value)
            self.context['project'] = project
        except Project.DoesNotExist:
            raise serializers.ValidationError('Project not found.')
        return value

    def validate_action(self, value):
        # only used when updating/responding
        if value not in ('accept', 'decline'):
            raise serializers.ValidationError('action must be "accept" or "decline"')
        return value

    def validate(self, attrs):
        # additional cross-field validation for update operations
        # if we're updating (instance exists) and an action is provided, ensure
        # the requesting user matches the invite's target email.
        if self.instance and 'action' in attrs:
            request = self.context.get('request')
            user = request.user if request else None
            if not user or user.email != self.instance.email:
                raise serializers.ValidationError(
                    'You can only respond to invitations sent to your email address.'
                )
        return attrs

    def create(self, validated_data):
        request = self.context.get('request')
        sender = request.user if request else None
        project_slug = validated_data.pop('project_slug', None)
        email = validated_data.get('email')
        role = validated_data.get('role_to_assign')

        print(f"DEBUG create() - project_slug: {project_slug}, email: {email}, role: {role}, sender: {sender}")

        result = ProjectInviteService.send_invite(
            project_slug=project_slug,
            recipient_email=email,
            role=role,
            sender_user=sender
        )

        #print(f"DEBUG ProjectInviteService result: {result}")

        if not result.get('success'):
            raise serializers.ValidationError(result.get('message', 'Unable to create invite'))

        return result['invite']

    def update(self, instance, validated_data):
        # expecting 'action' to be provided
        action = validated_data.get('action')
        if not action:
            raise serializers.ValidationError({'action': 'This field is required.'})

        request = self.context.get('request')
        user = request.user if request else None
        result = ProjectInviteResponseService.respond_to_invite(
            token=instance.token,
            action=action,
            user=user
        )

        if not result.get('success'):
            raise serializers.ValidationError(result.get('message', 'Unable to process invite response'))

        # refresh instance from db so status is updated
        instance.refresh_from_db()
        return instance


# ============================
# Discussion Thread & Comments Serializers
# ============================

class DiscussionCommentSerializer(serializers.ModelSerializer):
    user_details = serializers.SerializerMethodField()
    
    class Meta:
        model = DiscussionComment
        fields = [
            'id', 'comment_id', 'user', 'user_details', 'content', 
            'created_at', 'updated_at', 'is_edited', 'is_pinned'
        ]
        read_only_fields = ['id', 'comment_id', 'created_at', 'updated_at', 'is_edited']

    def get_user_details(self, obj):
        # Get user's role in the project
        role = None
        if hasattr(obj, 'thread') and obj.thread.project:
            project_role = UserProjectRole.objects.filter(
                user=obj.user,
                project=obj.thread.project
            ).first()
            role = project_role.role if project_role else None
        
        return {
            'id': obj.user.id,
            'username': obj.user.username,
            'email': obj.user.email,
            'full_name': obj.user.full_name or obj.user.username,
            'role': role,
        }


class DiscussionThreadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionThread
        fields = ['title', 'description', 'thread_type', 'labels']
        
    def create(self, validated_data):
        request = self.context.get('request')
        project_id = self.context.get('project_id')
        
        if not project_id or not request:
            raise serializers.ValidationError('Project ID and request are required.')
            
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise serializers.ValidationError('Project not found.')
        
        # Check if user is a project member
        is_member = UserProjectRole.objects.filter(
            project=project,
            user=request.user
        ).exists()
        
        if not is_member:
            raise serializers.ValidationError('You must be a project member to create discussions.')
        
        thread = DiscussionThread.objects.create(
            project=project,
            created_by=request.user,
            **validated_data
        )
        return thread


class DiscussionThreadDetailSerializer(serializers.ModelSerializer):
    created_by_details = serializers.SerializerMethodField()
    comments = DiscussionCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = DiscussionThread
        fields = [
            'id', 'thread_id', 'title', 'description', 'thread_type',
            'created_by', 'created_by_details', 'created_at', 'updated_at',
            'labels', 'is_closed', 'comment_count', 'last_activity', 'comments'
        ]
        read_only_fields = [
            'id', 'thread_id', 'created_at', 'updated_at', 'comment_count', 'last_activity'
        ]

    def get_created_by_details(self, obj):
        if not obj.created_by:
            return None
        return {
            'id': obj.created_by.id,
            'username': obj.created_by.username,
            'email': obj.created_by.email,
            'full_name': obj.created_by.full_name or obj.created_by.username,
        }


class DiscussionThreadListSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    latest_comment = serializers.SerializerMethodField()
    
    class Meta:
        model = DiscussionThread
        fields = [
            'id', 'thread_id', 'title', 'thread_type', 'created_by_username',
            'created_at', 'updated_at', 'labels', 'is_closed', 'comment_count',
            'last_activity', 'latest_comment'
        ]
        read_only_fields = fields

    def get_latest_comment(self, obj):
        latest = obj.comments.order_by('-created_at').first()
        if latest:
            return {
                'id': latest.id,
                'user': latest.user.username,
                'content': latest.content[:100] + '...' if len(latest.content) > 100 else latest.content,
                'created_at': latest.created_at,
            }
        return None


class DiscussionCommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionComment
        fields = ['content']
        
    def create(self, validated_data):
        request = self.context.get('request')
        thread_id = self.context.get('thread_id')
        
        if not thread_id or not request:
            raise serializers.ValidationError('Thread ID and request are required.')
        
        try:
            thread = DiscussionThread.objects.get(id=thread_id)
        except DiscussionThread.DoesNotExist:
            raise serializers.ValidationError('Discussion thread not found.')
        
        # Check if user is a project member
        is_member = UserProjectRole.objects.filter(
            project=thread.project,
            user=request.user
        ).exists()
        
        if not is_member:
            raise serializers.ValidationError('You must be a project member to comment.')
        
        if thread.is_closed:
            raise serializers.ValidationError('This discussion thread is closed.')
        
        comment = DiscussionComment.objects.create(
            thread=thread,
            user=request.user,
            **validated_data
        )
        return comment


class DiscussionCommentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscussionComment
        fields = ['content']
        
    def update(self, instance, validated_data):
        request = self.context.get('request')
        
        # Only allow user to edit their own comments
        if instance.user != request.user:
            raise serializers.ValidationError('You can only edit your own comments.')
        
        instance.content = validated_data.get('content', instance.content)
        instance.is_edited = True
        instance.edited_at = now()
        instance.save()
        return instance


# ============================
# Pull Request Serializers
# ============================

class PullRequestCreateSerializer(serializers.ModelSerializer):
    from_branch = serializers.CharField(write_only=True)
    to_branch = serializers.CharField(write_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = PullRequest
        fields = ['from_branch', 'to_branch', 'message', 'labels', 'reviewers', 'is_draft', 'created_by']
    
    def create(self, validated_data):
        request = self.context.get('request')
        project_slug = self.context.get('project_slug')
        from_branch_name = validated_data.pop('from_branch')
        to_branch_name = validated_data.pop('to_branch')
        
        try:
            project = Project.objects.get(slug=project_slug)
            from_branch = Branch.objects.get(project=project, name=from_branch_name)
            to_branch = Branch.objects.get(project=project, name=to_branch_name)
        except (Project.DoesNotExist, Branch.DoesNotExist):
            raise serializers.ValidationError('Invalid project or branch.')
        
        pull_request = PullRequest.objects.create(
            project=project,
            from_branch=from_branch,
            to_branch=to_branch,
            created_by=request.user,
            **validated_data
        )
        return pull_request


class PullRequestListSerializer(serializers.ModelSerializer):
    from_branch = serializers.CharField(source='from_branch.name', read_only=True)
    to_branch = serializers.CharField(source='to_branch.name', read_only=True)
    created_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = PullRequest
        fields = ['id', 'from_branch', 'to_branch', 'created_by', 'status', 'created_at', 'is_draft', 'message']


class PullRequestDetailSerializer(serializers.ModelSerializer):
    from_branch = serializers.CharField(source='from_branch.name', read_only=True)
    to_branch = serializers.CharField(source='to_branch.name', read_only=True)
    created_by = serializers.SerializerMethodField()
    
    class Meta:
        model = PullRequest
        fields = '__all__'
    
    def get_created_by(self, obj):
        if not obj.created_by:
            return None
        profile = getattr(obj.created_by, 'profile', None)
        return {
            'id': obj.created_by.id,
            'username': obj.created_by.username,
            'full_name': profile.full_name if profile else obj.created_by.get_full_name() or obj.created_by.username
        }
