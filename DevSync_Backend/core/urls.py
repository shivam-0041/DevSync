from django.urls import path
from .views import UserProfileDetailView, ProfileSettingsView, ChangePasswordView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('profile/', UserProfileDetailView.as_view(), name='user-profile'),
    path('profile/settings/', ProfileSettingsView.as_view(), name="profile-settings"),
    path('profile/password-update/',ChangePasswordView.as_view(),name='password-update'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
