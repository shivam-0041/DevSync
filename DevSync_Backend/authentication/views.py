# authentication/views.py

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import RegisteredUser
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import RegisteredUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})

from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator

@method_decorator(csrf_protect, name='dispatch')
class RegisterUserView(generics.CreateAPIView):
    serializer_class = RegisteredUserSerializer

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        if "password" in data:
            data["password"] = make_password(data["password"])

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User created successfully", "user": serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




# Function-based view for logging in a user
@api_view(['POST'])
@csrf_protect
def login_user(request):
    login_input = request.data.get("username")  # Could be username or email
    password = request.data.get("password")

    if not login_input or not password:
        return Response({"error": "Username/email and password are required"}, status=400)

    try:
        #print(login_input)
        # Try by username first
        user = RegisteredUser.objects.get(username=login_input)
    except RegisteredUser.DoesNotExist:
        # Then try by email
        try:
            user = RegisteredUser.objects.get(email=login_input)
        except RegisteredUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

    if check_password(password, user.password):
        return Response({
            "message": "Login successful",
            "username": user.username,
            "email": user.email,
            "full_name": f"{user.first_name} {user.last_name}"
        }, status=200)
    else:
        return Response({"error": "Invalid credentials"}, status=400)

def send_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    verify_url = f"http://127.0.0.1:8000/api/auth/verify/{uid}/{token}/"
    
    send_mail(
        subject="Verify your email",
        message=f"Click to verify your account: {verify_url}",
        from_email="your_email@example.com",
        recipient_list=[user.email],
    )

