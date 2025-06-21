# authentication/serializers.py

from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import RegisteredUser #, PendingUser

class RegisteredUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = RegisteredUser
        fields = ['first_name','last_name', 'username', 'email', 'password']

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


# class PendingUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = PendingUser
#         fields = [
#             'id',
#             'username',
#             'email',
#             'password',
#             'first_name',
#             'last_name',
#             'verification_code',
#             'code_expiry',
#             'created_at',
#         ]
#         extra_kwargs = {
#             'password': {'write_only': True},
#             'verification_code': {'write_only': True},
#         }

#     def create_registered_user(self, pending_user: PendingUser) -> RegisteredUser:
#         # Transform pending user into registered user
#         registered_user = RegisteredUser.objects.create(
#             username=pending_user.username,
#             email=pending_user.email,
#             password=make_password(pending_user.password),
#             first_name=pending_user.first_name,
#             last_name=pending_user.last_name,
#         )
#         pending_user.delete()
#         return registered_user
