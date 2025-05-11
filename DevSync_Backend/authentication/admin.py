from django.contrib import admin
from .models import RegisteredUser

class RegisteredUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']

admin.site.register(RegisteredUser, RegisteredUserAdmin)
