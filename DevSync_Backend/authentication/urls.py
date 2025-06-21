# authentication/urls.py

from django.urls import path
from .views import RegisterUserView, get_csrf_token,login_user #, PendingUserView ,send_verification_code_and_verify

urlpatterns = [
    path("csrf/", get_csrf_token, name="get-csrf-token"),
    path('register/', RegisterUserView.as_view()),
    #path('verify-code/', code_verfication, name='send-verification-code'),
    path('login/', login_user),
]
