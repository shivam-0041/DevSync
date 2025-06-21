from django.contrib import admin
from .models import Profile

@admin.register(Profile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'website')
    search_fields = ('user__username', 'location')