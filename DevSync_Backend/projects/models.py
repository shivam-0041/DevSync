import uuid
import secrets
from datetime import timedelta
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.timezone import now

User = get_user_model()

def generate_hex_id():
    return uuid.uuid4().hex[:16]

def upload_to_project(instance, filename):
    return f"projects/{instance.project.id}/{filename}"

def generate_project_id():
    return f"proj-{uuid.uuid4().hex[:12]}"

def generate_task_id():
    return f"Task-{uuid.uuid4().hex[:6].upper()}"

def generate_invite_token():
    """Generate a secure random token for project invites"""
    return secrets.token_urlsafe(32)

# ============================
# Project Model
# ============================
class Project(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('pending','Pending'),
        ('completed', 'Completed'),
    ]

    VISIBILITY_CHOICES = [
        ('private', 'Private'),
        ('team', 'Team'),
        ('public', 'Public'),
    ]

    project_id = models.CharField(max_length=20, unique=True, editable=False, default=generate_project_id)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    members = models.ManyToManyField(
        User,
        through='UserProjectRole',
        related_name='projects'
    )
    slug = models.SlugField(unique=True, blank=True)
    logo = models.ImageField(upload_to='project_logos/', blank=True, null=True)
    languages = models.CharField(max_length=200, blank=True, editable=False)
    discussions_enabled = models.BooleanField(default=True)
    stars = models.IntegerField(default=0)
    watchers = models.IntegerField(default=0)
    forks = models.IntegerField(default=0)
    issues = models.IntegerField(default=0)
    pull_requests_count = models.IntegerField(default=0)
    readme = models.TextField(blank=True, null=True)
    progress = models.IntegerField(default=0)
    template = models.CharField(max_length=100, blank=True, null=True)
    gitignore = models.CharField(max_length=100, blank=True, null=True)
    license = models.CharField(max_length=100, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='private')

    chat_id = models.CharField(max_length=16, unique=True, editable=False)
    whiteboard_id = models.CharField(max_length=16, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    issues_enabled = models.BooleanField(default=True)
    wiki_enabled = models.BooleanField(default=False)
    boards_enabled = models.BooleanField(default=False)
    auto_init = models.BooleanField(default=False)

    @property
    def branches_count(self):
        return self.branches.count()
    
    def discussion_count(self):
        return self.threads.count()
    
    def commits_count(self):
        return self.activities.filter(action="commit").count()
    
    def issue_count(self):
        return self.issues
    
    def open_pull_request_count(self):
        return self.pull_requests.filter(status="open").count()
    

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)

            # Ensure uniqueness based on visibility
            if self.visibility == 'private':
                # Scoped uniqueness per user
                slug = base_slug
                counter = 1
                while Project.objects.filter(slug=slug, visibility='private', created_by=self.created_by).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
            else:
                # Global uniqueness for public
                slug = base_slug
                counter = 1
                while Project.objects.filter(slug=slug, visibility='public').exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1

            self.slug = slug
        if not self.chat_id:
            self.chat_id = generate_hex_id()
        if not self.whiteboard_id:
            self.whiteboard_id = generate_hex_id()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


# ============================
# Branch Model
# ============================
class Branch(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='branches')
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['project', 'name']

    def __str__(self):
        return f"{self.project.name} - {self.name}"


# ============================
# Discussion Thread Model
# ============================
class DiscussionThread(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='threads')
    title = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title

# ============================
# Code File Model
# ============================
class CodeFile(models.Model):
    FILE = 'file'
    FOLDER = 'folder'
    ITEM_TYPES = [
        (FILE, 'File'),
        (FOLDER, 'Folder'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='files')
    branch = models.ForeignKey(Branch, on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')

    name = models.CharField(max_length=255)
    item_type = models.CharField(max_length=10, choices=ITEM_TYPES, default='file')
    file = models.FileField(upload_to=upload_to_project, blank=True, null=True)  # used only if item_type == 'file'

    uploaded_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    filetype = models.CharField(max_length=50, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.item_type == self.FILE and self.file and not self.filetype:
            self.filetype = self.file.name.split('.')[-1]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.item_type.upper()}] {self.name}"


# ============================
# Pull Request Model
# ============================
class PullRequest(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='pull_requests')
    from_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='outgoing_prs')
    to_branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name='incoming_prs')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=[('open', 'Open'), ('merged', 'Merged'), ('rejected', 'Rejected')], default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    labels = models.JSONField(default=list, blank=True)
    reviewers = models.JSONField(default=list, blank=True)
    is_draft = models.BooleanField(default=False)
    
    def __str__(self):
        return f"PR: {self.from_branch} -> {self.to_branch} | {self.project} | {self.status}"


# ============================
# Project Activity Model
# ============================
class ProjectActivity(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=200)  # e.g., "Created branch", "Committed code"
    timestamp = models.DateTimeField(auto_now_add=True)
    extra_data = models.JSONField(blank=True, null=True) 



# ============================
# Project Tasks Model
# ============================

def validate_deadline(value):
    if value < now().date():
        raise ValidationError("Deadline cannot be in the past.")
    
class ProjectTask(models.Model):

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical","Critical")
    ]

    STATUS_CHOICES = [
        ("in_progress", "In Progress"),
        ("to_do", "To Do"),
        ("review", "Review"),
        ("done", "Done"),
    ]

    task_id = models.CharField(
        max_length=20,
        default=generate_task_id,
        unique=True,
        editable=False
    )
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=50, blank=False, null=False)
    description = models.TextField()
    assign_to = models.ForeignKey(User, on_delete=models.SET_NULL,related_name="assigned_tasks", null=True)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    deadline = models.DateField(validators=[validate_deadline])
    labels = models.JSONField(default=list, blank=True)
    dependencies = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="to_do")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title}({self.project.name})"


# ============================
# UserProjectRole Model
# ============================

class UserProjectRole(models.Model):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("maintainer", "Maintainer"),
        ("developer", "Developer"),
        ("guest", "Guest"),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    role = models.CharField(max_length=15, choices=ROLE_CHOICES)
    branch_name = models.CharField(max_length=255, blank=True, null=True)  # For collaborators only

    class Meta:
        unique_together = ("user", "project")
    def __str__(self):
        return f"{self.user} - {self.project} ({self.role})"


# ============================
# Project Invite Model
# ============================
class ProjectInvite(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='invites')
    email = models.EmailField()
    role_to_assign = models.CharField(max_length=15, choices=UserProjectRole.ROLE_CHOICES, default="developer")
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined'), ('expired', 'Expired')], default='pending')
    
    # Security fields
    token = models.CharField(max_length=255, unique=True, editable=False, default=generate_invite_token)
    expires_at = models.DateTimeField(editable=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Set expiry to 72 hours from now
            self.expires_at = now() + timedelta(hours=72)
        super().save(*args, **kwargs)
    
    def is_expired(self):
        """Check if the invite token has expired"""
        return now() > self.expires_at
    
    def is_valid(self):
        """Check if invite is valid (not expired and status is pending)"""
        return self.status == 'pending' and not self.is_expired()
    
    def __str__(self):
        return f"{self.email} - {self.project.name} ({self.status})"
    

# ============================
# Issues Model
# ============================

class Issue(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("closed", "Closed"),
    ]

    ISSUE_TYPES= [
        ("bug_report", "Bug Report"),
        ("feature_request", "Feature Request"),
        ("improvement", "Improvement"),
        ("question", "Question"),
    ]

    PRIORITY_CHOICES = [
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("critical","Critical")
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="issues_list")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="open")
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_issues")
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPES, default="Bug Report")
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    labels = models.JSONField(default=list, blank=True)


    def __str__(self):
        return f"Issue #{self.id} - {self.title}"



# ============================
# Tags Model for search/analytics
# ============================
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

class ProjectTag(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tag_links')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.tag.name} - {self.project.name}"


# ============================
# Notifications Model
# ============================

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)



class LanguageUsage(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="languages_usage")
    language = models.CharField(max_length=50)
    percentage = models.FloatField()
    def __str__(self):
        return f"{self.language} ({self.percentage}%) - {self.project.name}"

# ---- Chat/Whiteboard models for repositories ----
class Chat(models.Model):
    repository = models.OneToOneField('Project', on_delete=models.CASCADE, related_name='chat')
    created_at = models.DateTimeField(auto_now_add=True)
    participants = models.ManyToManyField(User)

class Whiteboard(models.Model):
    repository = models.OneToOneField('Project', on_delete=models.CASCADE, related_name='whiteboard')
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

