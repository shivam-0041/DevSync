# devsync/models.py

'''
from django.db import models
from django.contrib.auth.models import User
import uuid

class Project(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    visibility = models.CharField(max_length=10, choices=[("public", "Public"), ("private", "Private")])
    owner = models.ForeignKey(User, related_name='owned_projects', on_delete=models.CASCADE)
    language = models.CharField(max_length=100)
    stars = models.IntegerField(default=0)
    watchers = models.IntegerField(default=0)
    forks = models.IntegerField(default=0)
    issues = models.IntegerField(default=0)
    pull_requests = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)
    readme = models.TextField(blank=True, null=True)
    progress = models.IntegerField(default=0)

class UserProjectRole(models.Model):
    ROLE_CHOICES = [
        ("owner", "Owner"),
        ("collaborator", "Collaborator"),
        ("contributor", "Contributor")
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    branch_name = models.CharField(max_length=255, blank=True, null=True)  # For collaborators only

    class Meta:
        unique_together = ("user", "project")

class Branch(models.Model):
    name = models.CharField(max_length=255)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="branches")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

class PullRequest(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    source_branch = models.CharField(max_length=255)
    target_branch = models.CharField(max_length=255, default="main")
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[("open", "Open"), ("approved", "Approved"), ("rejected", "Rejected")])
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="reviewed_prs")

class Task(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=[("todo", "To Do"), ("in-progress", "In Progress"), ("done", "Done")])
    assignee = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    due_date = models.DateTimeField()

class Commit(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="commits")
    message = models.TextField()
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

class Activity(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="activities")
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)

class LanguageUsage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="languages")
    language = models.CharField(max_length=50)
    percentage = models.FloatField()

class CodeFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="code_files")
    parent_folder = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE)
    is_folder = models.BooleanField(default=False)
    name = models.CharField(max_length=255)
    content = models.TextField(blank=True, null=True)

# ---- Chat/Whiteboard models for repositories ----
class Chat(models.Model):
    repository = models.OneToOneField('Repository', on_delete=models.CASCADE, related_name='chat')
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User)

class Whiteboard(models.Model):
    repository = models.OneToOneField('Repository', on_delete=models.CASCADE, related_name='whiteboard')
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

def has_access(user, repository):
    try:
        role = RepositoryRole.objects.get(user=user, repository=repository)
        return role.role in ['owner', 'collaborator']
    except RepositoryRole.DoesNotExist:
        return False

'''