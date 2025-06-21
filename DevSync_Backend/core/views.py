from rest_framework import generics, permissions
from .models import Profile
from .serializers import ProfileSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
User = get_user_model()

class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    """
    Allows the authenticated user to view and update their own profile.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user=request.user)
        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=404)

        serializer = ProfileSerializer(profile, context={"request": request})
        return Response(serializer.data)