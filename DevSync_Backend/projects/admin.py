# devsync/admin.py

'''
from django.contrib import admin
from .models import (
    Project, UserProjectRole, Branch, PullRequest, Task,
    Commit, Activity, LanguageUsage, CodeFile, Chat, Whiteboard
)

admin.site.register(Project)
admin.site.register(UserProjectRole)
admin.site.register(Branch)
admin.site.register(PullRequest)
admin.site.register(Task)
admin.site.register(Commit)
admin.site.register(Activity)
admin.site.register(LanguageUsage)
admin.site.register(CodeFile)
admin.site.register(Chat)
admin.site.register(Whiteboard)
'''

from django.contrib import admin
from .models import (
    Project,
    Branch,
    DiscussionThread,
    CodeFile,
)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_by', 'visibility', 'status', 'created_at')
    search_fields = ('name', 'created_by__username')
    list_filter = ('visibility', 'status', 'created_at')

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
