from rest_framework import serializers
from .models import Profile

# We'll use this to include user fields like username and email
from django.contrib.auth import get_user_model
User = get_user_model()

# class UserPublicSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username', 'email', 'first_name', 'last_name']

# class ProfileSerializer(serializers.ModelSerializer):
#     user = UserPublicSerializer(read_only=True)

#     class Meta:
#         model = Profile
#         fields = [
#             'user',           # Includes username, email, first & last name
#             'bio',
#             'avatar',
#             'company',
#             'location',
#             'website',
#             'github',
#             'twitter',
#             'linkedin',
#             'personal_website',
#             'skills'
#         ]

class ProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    username = serializers.CharField(source="user.username")
    email = serializers.EmailField(source="user.email")
    joinedDate = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    socialLinks = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "name", "username", "avatar", "bio", "location",
            "email", "website", "joinedDate", "company",
            "followers", "following", "repositories", "contributions",
            "skills", "socialLinks"
        ]

    def get_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip()

    def get_joinedDate(self, obj):
        return obj.user.created_at.strftime("%Y-%m-%d")

    def get_avatar(self, obj):
        if obj.avatar:
            return self.context["request"].build_absolute_uri(obj.avatar.url)
        return "/placeholder.svg?height=200&width=200"

    def get_socialLinks(self,obj):
        return {
            "github": obj.github,
            "twitter": obj.twitter,
            "linkedin": obj.linkedin,
            "personal_website": obj.personal_website
        }




class ProfileUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(source='user.username', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    skills = serializers.JSONField(required=False)
    
    class Meta:
        model = Profile
        fields = [
            "avatar", "full_name", "username", "email", "location",
            "bio", "github", "linkedin", "personal_website", "twitter",
            "company", "skills"
        ]


    def update(self, instance, validated_data):
        # Extract user data and profile data
        user_data = validated_data.pop('user', {})
        full_name = validated_data.pop('full_name', None)
        skills_data = validated_data.get('Skills', {}).get('skill', None)

        user = instance.user

        # Update username and email
        if 'username' in user_data:
            user.username = user_data['username']
        if 'email' in user_data:
            user.email = user_data['email']

        if 'avatar' in validated_data:
            avatar_value = validated_data['avatar']
            if avatar_value in [None, '', 'null', '__REMOVE__']:
                instance.avatar.delete(save=False)
                validated_data.pop('avatar', None)

        if skills_data is not None:
            instance.Skills = {"skill": skills_data}

        # Handle full name
        if full_name:
            parts = full_name.strip().split(" ", 1)
            user.first_name = parts[0]
            user.last_name = parts[1] if len(parts) > 1 else ""

        
        user.save()
        # Update Profile model fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
         
        return instance
    

class PasswordUpdateSerializer(serializers.ModelSerializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password = serializers.CharField(required=True)

    class Meta:
        model = Profile
        fields = ['current_password', 'new_password', 'confirm_password']

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs