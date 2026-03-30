from django.db import models
from django.conf import settings  # To import RegisteredUser dynamically
from authentication.models import RegisteredUser  # Import the RegisteredUser model

# Profile model linked to your RegisteredUser model in authentication app
class Profile(models.Model):
    user = models.OneToOneField(
            settings.AUTH_USER_MODEL,
            on_delete=models.CASCADE,
            related_name='profile'
    )
    # Extended user info (not stored in RegisteredUser)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True,null=True, default='avatars/def-avatar.svg')

    # Professional & personal info
    company = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)

    # Social links
    github = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    personal_website = models.URLField(blank=True)

    followers = models.IntegerField(default=0)
    following = models.IntegerField(default=0)
    repositories = models.IntegerField(default=0)
    contributions = models.IntegerField(default=0)

    # Skills/Tech stack
    skills = models.JSONField(blank=True, default=list)

    @property
    def joined_at(self):
        return self.user.created_at

    def __str__(self):
        return f"{self.user.username}'s Profile"


# Follow relationship model
class Follow(models.Model):
    """Model to track follow relationships between users"""
    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='following_relationships'
    )
    following = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='follower_relationships'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('follower', 'following')
        indexes = [
            models.Index(fields=['follower']),
            models.Index(fields=['following']),
        ]

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"
