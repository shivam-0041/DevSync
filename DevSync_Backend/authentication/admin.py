from django.contrib import admin
from .models import RegisteredUser #, PendingUser

class RegisteredUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']

admin.site.register(RegisteredUser, RegisteredUserAdmin)

class PendingUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'last_name', 'created_at','verification_code','code_expiry','created_at']
    search_fields = ['username', 'email', 'first_name', 'last_name']
    list_filter = ('created_at', 'code_expiry')
    ordering = ('-created_at',)

#admin.site.register(PendingUser, PendingUserAdmin)