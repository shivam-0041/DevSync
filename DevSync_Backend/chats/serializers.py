# Converts ChatMessage DB objects to JSON for the history REST endpoint

from rest_framework import serializers
from .models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    # We override sender because it's a ForeignKey — we want a nested object,
    # not just a raw user ID
    sender = serializers.SerializerMethodField()

    class Meta:
        model = ChatMessage
        fields = ['id', 'sender', 'content', 'timestamp']

    def get_sender(self, obj):
        # Safely try to get the profile avatar
        # profile is a related OneToOne from RegisteredUser
        profile = getattr(obj.sender, 'profile', None)
        avatar_url = None
        if profile and hasattr(profile, 'avatar') and profile.avatar:
            request = self.context.get('request')
            if request:
                avatar_url = request.build_absolute_uri(profile.avatar.url)
            else:
                avatar_url = profile.avatar.url

        return {
            'id': obj.sender.id,
            'username': obj.sender.username,
            'avatar': avatar_url,
        }