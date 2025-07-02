import uuid
from django.db import models
from django.utils.text import slugify
from django.contrib.auth import get_user_model

User = get_user_model()

def generate_hex_id():
    return uuid.uuid4().hex[:16]

def upload_to_project(instance, filename):
    return f"projects/{instance.project.id}/{filename}"

def generate_project_id():
    return f"proj-{uuid.uuid4().hex[:12]}"

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

    project_id = models.CharField(max_length=20, unique=True, editable=False, default=generate_project_id())
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_projects')
    members = models.ManyToManyField(User, related_name='projects')
    slug = models.SlugField(unique=True, blank=True)
    logo = models.ImageField(upload_to='project_logos/', blank=True, null=True)
    languages = models.CharField(max_length=200, blank=True, editable=False)
    discussions_enabled = models.BooleanField(default=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='private')

    chat_id = models.CharField(max_length=16, unique=True, editable=False)
    whiteboard_id = models.CharField(max_length=16, unique=True, editable=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

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
# Comment Model
# ============================
class Comment(models.Model):
    thread = models.ForeignKey(DiscussionThread, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.thread.title}"


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


# ============================
# Project Activity Model
# ============================
class ProjectActivity(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=200)  # e.g., "Created branch", "Committed code"
    timestamp = models.DateTimeField(auto_now_add=True)
    extra_data = models.JSONField(blank=True, null=True)  # For future flexibility


# ============================
# Project Invite Model
# ============================
class ProjectInvite(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='invites')
    email = models.EmailField()
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)


# ============================
# Tags Model for search/analytics
# ============================
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

class ProjectTag(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tag_links')
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)


# ============================
# Notifications Model
# ============================

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
