# devsync/admin.py
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
