from rest_framework import serializers
from .models import Project, CodeFile,Branch, ProjectActivity, Issue, Whiteboard, ProjectTask
from django.contrib.auth import get_user_model

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
        project.members.add(user)
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
    activities = serializers.SerializerMethodField()
    contributors = serializers.SerializerMethodField()
    issues = serializers.SerializerMethodField()
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
            "activities",
            "contributors",
            "issues",
            "readme",
            "commit_count",
            "branch_count",
            "issues_count",
            "pull_requests_count",
            "updated_at",
            "whiteboard_id",
            "chat_id",
            "slug",
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


class ProjectTaskListSerializer(serializers.ModelSerializer):
    assign_to_name = serializers.CharField(source="assign_to.username", read_only=True)
    project_name = serializers.CharField(source="project.title", read_only=True)

    class Meta:
        model = ProjectTask
        fields = [
            "id", "task_id", "title", "description",
            "priority", "status", "deadline",
            "labels", "dependencies",
            "assign_to_name", "project_name"
        ]