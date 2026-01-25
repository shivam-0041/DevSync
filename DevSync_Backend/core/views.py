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