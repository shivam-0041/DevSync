#to handle socket connection and connect all functions for chat

import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatSession, ChatMessage

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Retrieve the session ID from routing kwargs
        self.session_id = self.scope['url_route']['kwargs']['session_id']
        self.room_group_name = f'chat_{self.session_id}'
        self.authenticated = False

        # Upgrade/accept the connection immediately
        await self.accept()

        # Start a 5-second authentication timeout task
        self.auth_timeout_task = asyncio.create_task(self.check_auth_timeout())

    async def disconnect(self, close_code):
        # Cancel the timeout task if it is running
        if hasattr(self, 'auth_timeout_task'):
            self.auth_timeout_task.cancel()

        # Discard room group
        if hasattr(self, 'room_group_name') and self.authenticated:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def check_auth_timeout(self):
        try:
            await asyncio.sleep(5)  # Allow 5 seconds to authenticate
            if not self.authenticated:
                await self.close(code=4003)
        except asyncio.CancelledError:
            pass

    # Receive message from WebSocket client
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        except Exception:
            return

        # Handle post-connection authentication (Strategy A)
        if not self.authenticated:
            if data.get('type') == 'auth':
                token = data.get('token')
                user = await self.verify_token(token)
                if user:
                    self.scope['user'] = user
                    # Verify project access
                    has_access = await self.check_user_access(user, self.session_id)
                    if not has_access:
                        await self.close(code=4001)
                        return

                    self.authenticated = True
                    
                    # Join channels group
                    await self.channel_layer.group_add(
                        self.room_group_name,
                        self.channel_name
                    )

                    # Cancel the timeout task
                    if hasattr(self, 'auth_timeout_task'):
                        self.auth_timeout_task.cancel()
                else:
                    await self.close(code=4002)
            else:
                await self.close(code=4003)
            return

        # Normal message flow (only if authenticated)
        message_content = data.get('message', '').strip()
        if not message_content:
            return

        # Save message to database and serialize it (including sender details like avatar)
        serialized_msg = await self.save_and_serialize_message(self.scope['user'], self.session_id, message_content)

        # Broadcast to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': serialized_msg
            }
        )

    # Receive message from room group broadcast
    async def chat_message(self, event):
        message = event['message']
        await self.send(text_data=json.dumps(message))

    @database_sync_to_async
    def verify_token(self, token):
        from rest_framework_simplejwt.tokens import AccessToken
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            access_token = AccessToken(token)
            user_id = access_token["user_id"]
            user = User.objects.get(id=user_id)
            if user.is_active:
                return user
        except Exception:
            pass
        return None

    @database_sync_to_async
    def check_user_access(self, user, session_id):
        from projects.models import Project
        try:
            try:
                session = ChatSession.objects.select_related('repository').get(id=int(session_id))
            except (ValueError, ChatSession.DoesNotExist):
                try:
                    session = ChatSession.objects.select_related('repository').get(repository__chat_id=session_id)
                except ChatSession.DoesNotExist:
                    project = Project.objects.get(chat_id=session_id)
                    session, _ = ChatSession.objects.get_or_create(repository=project)

            project = session.repository
            return project.created_by == user or project.members.filter(id=user.id).exists()
        except Exception:
            return False

    @database_sync_to_async
    def save_and_serialize_message(self, user, session_id, content):
        from projects.models import Project
        try:
            session = ChatSession.objects.select_related('repository').get(id=int(session_id))
        except (ValueError, ChatSession.DoesNotExist):
            try:
                session = ChatSession.objects.select_related('repository').get(repository__chat_id=session_id)
            except ChatSession.DoesNotExist:
                project = Project.objects.get(chat_id=session_id)
                session, _ = ChatSession.objects.get_or_create(repository=project)

        msg = ChatMessage.objects.create(
            session=session,
            sender=user,
            content=content
        )
        
        # Parse mentions
        import re
        from projects.models import Notification
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        usernames = re.findall(r'@(\w+)', content)
        if usernames:
            users = User.objects.filter(username__in=set(usernames))
            for mentioned_user in users:
                if mentioned_user != user:
                    Notification.objects.create(
                        recipient=mentioned_user,
                        project=session.repository,
                        title="Mention in Chat",
                        message=f"{user.username} mentioned you in chat: {session.repository.name}",
                        notification_type='mention'
                    )

        from .serializers import ChatMessageSerializer
        return ChatMessageSerializer(msg).data