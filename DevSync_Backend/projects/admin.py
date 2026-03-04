# devsync/admin.py

from django.contrib import admin
from .models import (
    Project,
    Branch,
    DiscussionThread,
    CodeFile,
    Issue,
    ProjectTask,
    PullRequest,
)


class ProjectMemberInline(admin.TabularInline):
    model = Project.members.through
    extra = 1


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'visibility', 'status', 'created_at')
    search_fields = ('name', 'created_by__username')
    list_filter = ('visibility', 'status', 'created_at')
    inlines = [ProjectMemberInline]

@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'project', 'created_by', 'is_default', 'created_at')
    search_fields = ('name', 'project__name')
    list_filter = ('is_default',)

@admin.register(DiscussionThread)
class DiscussionThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'project', 'created_by', 'created_at')


@admin.register(CodeFile)
class CodeFileAdmin(admin.ModelAdmin):
    list_display = ('name', 'item_type', 'project', 'branch', 'parent', 'uploaded_by', 'uploaded_at')
    list_filter = ('item_type', 'uploaded_at', 'filetype')
    search_fields = ('name', 'filetype')
    autocomplete_fields = ('parent', 'project', 'branch', 'uploaded_by')

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "status",
        "project",
        "created_by",
        "assigned_to",
        "created_at",
        "updated_at",
    )
    list_filter = ("status", "created_at", "updated_at", "project")
    search_fields = ("title", "description", "created_by__username", "assigned_to__username")
    ordering = ("-created_at",)


@admin.register(ProjectTask)
class ProjectTaskAdmin(admin.ModelAdmin):
    list_display = (
        "task_id",
        "title",
        "project",
        "assign_to",
        "priority",
        "status",
        "deadline",
        "created_at",
        "updated_at",
    )
    list_filter = ("priority", "status", "project", "assign_to", "deadline")
    search_fields = ("task_id", "title", "description", "assign_to__username", "project__name")
    ordering = ("-created_at",)
    date_hierarchy = "deadline"

@admin.register(PullRequest)
class PullRequest(admin.ModelAdmin):
    list_display = ("id", "project", "from_branch", "to_branch", "created_by", "status", "is_draft", "created_at")
    list_filter = ("status", "is_draft", "created_at", "project")
    search_fields = ("project__name", "from_branch__name", "to_branch__name", "created_by__username", "message")
    ordering = ("-created_at",)