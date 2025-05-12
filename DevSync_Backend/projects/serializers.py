# devsync/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Project, UserProjectRole, Branch, PullRequest, Task, Commit,
    Activity, LanguageUsage, CodeFile, Chat, Whiteboard
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ChatSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ['id', 'repository', 'created_at', 'participants']

class WhiteboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Whiteboard
        fields = ['id', 'repository', 'data', 'updated_at']

class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Project
        fields = '__all__'
