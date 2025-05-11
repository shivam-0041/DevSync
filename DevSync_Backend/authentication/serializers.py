# authentication/serializers.py

from rest_framework import serializers
from .models import RegisteredUser

class RegisteredUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisteredUser
        fields = ['first_name', 'username', 'email', 'password']

    def validate_email(self, value):
        if RegisteredUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def validate_username(self, value):
        if RegisteredUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def create(self, validated_data):
        # Password is already hashed in the view, but keep for safety
        return RegisteredUser.objects.create(**validated_data)
