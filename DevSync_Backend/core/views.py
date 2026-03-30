from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import ProfileUpdateSerializer, PasswordUpdateSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
User = get_user_model()


#@csrf_exempt
#@api_view(['GET'])
class UserProfileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:

            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=404)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)


class PublicProfileView(APIView):
    permission_classes = []  # No authentication required for public profiles

    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            profile = Profile.objects.get(user=user)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=404)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=404)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)



#FOR LATER USE
# Decoding the Token (Backend):
# If you need to verify the token on future requests (e.g., for protected routes), you can decode it like this:

# from django.conf import settings
# import jwt

# def decode_token(token):
#     try:
#         payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#         return payload
#     except jwt.ExpiredSignatureError:
#         return None  # Token has expired
#     except jwt.InvalidTokenError:
#         return None  # Invalid token
# You can use this helper function to verify and extract data from the token (e.g., user ID) in your protected views.




class ProfileSettingsView(RetrieveUpdateAPIView):
    serializer_class = ProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  

    def get_object(self):
        return self.request.user.profile
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordUpdateSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['current_password']):
                return Response({"error": "Incorrect current password"}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"success": "Password updated successfully"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def follow_user(request, username):
    """Follow a user"""
    from .models import Follow
    
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    if target_user.id == request.user.id:
        return Response({'error': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Create the follow relationship
    follow_obj, created = Follow.objects.get_or_create(
        follower=request.user,
        following=target_user
    )
    
    if not created:
        return Response({'error': 'You are already following this user'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Update follower/following counts
    target_user.profile.followers += 1
    target_user.profile.save()
    
    request.user.profile.following += 1
    request.user.profile.save()
    
    return Response({
        'is_following': True,
        'followers_count': target_user.profile.followers,
        'message': f'You are now following {username}'
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, username):
    """Unfollow a user"""
    from .models import Follow
    
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    try:
        follow_obj = Follow.objects.get(follower=request.user, following=target_user)
    except Follow.DoesNotExist:
        return Response({'error': 'You are not following this user'}, status=status.HTTP_400_BAD_REQUEST)
    
    follow_obj.delete()
    
    # Update follower/following counts
    target_user.profile.followers = max(0, target_user.profile.followers - 1)
    target_user.profile.save()
    
    request.user.profile.following = max(0, request.user.profile.following - 1)
    request.user.profile.save()
    
    return Response({
        'is_following': False,
        'followers_count': target_user.profile.followers,
        'message': f'You have unfollowed {username}'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def is_following(request, username):
    """Check if current user is following the target user"""
    from .models import Follow
    
    if not request.user.is_authenticated:
        return Response({'is_following': False}, status=status.HTTP_200_OK)
    
    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    is_following = Follow.objects.filter(
        follower=request.user,
        following=target_user
    ).exists()
    
    return Response({'is_following': is_following}, status=status.HTTP_200_OK)


def _serialize_social_user(request, user, is_following=False):
    profile = getattr(user, 'profile', None)
    avatar_url = "/def-avatar.svg"

    if profile and profile.avatar:
        try:
            avatar_url = request.build_absolute_uri(profile.avatar.url)
        except Exception:
            avatar_url = "/def-avatar.svg"

    name = f"{user.first_name} {user.last_name}".strip() or user.username

    return {
        'id': user.id,
        'username': user.username,
        'name': name,
        'avatar': avatar_url,
        'bio': profile.bio if profile else "",
        'is_following': is_following,
    }


@api_view(['GET'])
def followers_list(request, username):
    from .models import Follow

    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    followers = User.objects.filter(
        following_relationships__following=target_user
    ).select_related('profile').distinct().order_by('username')

    following_usernames = set()
    if request.user.is_authenticated:
        following_usernames = set(
            Follow.objects.filter(
                follower=request.user,
                following__in=followers
            ).values_list('following__username', flat=True)
        )

    data = [
        _serialize_social_user(
            request,
            follower,
            is_following=(follower.username in following_usernames),
        )
        for follower in followers
    ]

    return Response({'count': len(data), 'results': data}, status=status.HTTP_200_OK)


@api_view(['GET'])
def following_list(request, username):
    from .models import Follow

    try:
        target_user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    following = User.objects.filter(
        follower_relationships__follower=target_user
    ).select_related('profile').distinct().order_by('username')

    following_usernames = set()
    if request.user.is_authenticated:
        following_usernames = set(
            Follow.objects.filter(
                follower=request.user,
                following__in=following
            ).values_list('following__username', flat=True)
        )

    data = [
        _serialize_social_user(
            request,
            followed_user,
            is_following=(followed_user.username in following_usernames),
        )
        for followed_user in following
    ]

    return Response({'count': len(data), 'results': data}, status=status.HTTP_200_OK)