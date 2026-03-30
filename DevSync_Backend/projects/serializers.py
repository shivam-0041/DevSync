from rest_framework import serializers
from .models import Project, CodeFile, Branch, ProjectActivity, Issue, Whiteboard, ProjectTask, ProjectInvite, UserProjectRole
from django.contrib.auth import get_user_model
from .utils import ProjectInviteService, ProjectInviteResponseService
from django.db import models

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

    class Meta:
        model = Project
        fields = '__all__' 



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
        ]

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
                "title": thread.title,
                "created_by": thread.created_by.username if thread.created_by else None,
                "created_at": thread.created_at,
            }
            for thread in obj.threads.select_related("created_by").all().order_by("-created_at")
        ]

    


class WhiteboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Whiteboard
        fields = ["id", "repository", "data", "updated_at"]
        read_only_fields = ["id", "repository", "updated_at"]


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
