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
        return obj.user.created_at.strftime("%B %Y")

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
