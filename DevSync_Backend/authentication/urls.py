# authentication/urls.py

from django.urls import path
from .views import RegisterUserView, get_csrf_token

urlpatterns = [
    path("csrf/", get_csrf_token, name="get-csrf-token"),
    path('register/', RegisterUserView.as_view()),
    #path('login/', login_user),
]
