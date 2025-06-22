from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
User = get_user_model()

class UserProfileDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
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

