# authentication/views.py
from email.policy import default
from urllib import response
from rest_framework.decorators import api_view
from .models import RegisteredUser
from django.contrib.auth.hashers import check_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from rest_framework import status, generics
from rest_framework.response import Response
from .serializers import RegisteredUserSerializer #, PendingUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse
import random
from rest_framework.views import APIView
from rest_framework import status
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.sessions.models import Session
from django.utils import timezone
from datetime import timedelta
import time
#from .models import PendingUser

verification_codes = {}


def send_mail_page(request,name,email):
    code=random.randint(100000,999999)
    context = {}

    if request.method == 'POST':
        address = request.POST.get('email')
        subject = "DevSync Email Verification code is: ",code
        message = f"""
                    Hi {name},

                    Thank you for registering with DevSync!

                    To complete your sign-up, please use the verification code below:

                    Your verification code: {code}

                    This code will expire in 10 minutes. If you didn't request this, please ignore this email.

                    - The DevSync Team
                    """

        if address and subject and message:
            try:
                send_mail(subject, message, settings.EMAIL_HOST_USER, [address])
                context['result'] = 'Email sent successfully'
            except Exception as e:
                context['result'] = f'Error sending email: {e}'
            finally:
                print("done")

        else:
            context['result'] = 'All fields are required'
    
    return Response(
                    {"message": "Email Sent Successfully"},
                    status=status.HTTP_201_CREATED
                )





def code_verification(request,email,code):
    pass





@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({'message': 'CSRF cookie set'})







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
                # Generate a verification code
                send_mail_page(request, data['first_name'], data['email']);
                print("code sent")
                return Response(
                    {"message": "User created successfully", "user": serializer.data},
                    status=status.HTTP_201_CREATED
                )
            else:
                return Response({"error": "Verification code is incorrect"}, status=400)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)






# @method_decorator(csrf_protect, name='dispatch')
# class PendingUserView(generics.CreateAPIView):
#     serializer_class = PendingUserSerializer
#     print("PendingUserOpen")
#     def post(self, request, *args, **kwargs):
#         data = request.data.copy()

#         # Generate code + expiry
#         from random import randint
#         from datetime import datetime, timedelta
#         code = str(randint(100000, 999999))
#         expiry = datetime.now() + timedelta(minutes=10)

#         # Hash the password
#         if "password" in data:
#             data["password"] = make_password(data["password"])
        
#         # Inject code + expiry
#         data["verification_code"] = code
#         data["code_expiry"] = expiry

#         print("PendingUserContinue")

#         serializer = self.get_serializer(data=data)
#         if serializer.is_valid():
#             serializer.save()

#             # Send email with code after saving
#             send_mail_page(
#                 name=data.get("first_name"),
#                 email=data["email"],
#             )

#             return Response(
#                 {"message": "Pending user created. Verification code sent."},
#                 status=status.HTTP_201_CREATED
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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



