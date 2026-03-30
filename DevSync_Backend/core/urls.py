from django.urls import path
from .views import UserProfileDetailView, PublicProfileView, ProfileSettingsView, ChangePasswordView, follow_user, unfollow_user, is_following, followers_list, following_list
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('profile/', UserProfileDetailView.as_view(), name='user-profile'),
    path('users/<str:username>/', PublicProfileView.as_view(), name='public-profile'),
    path('profile/settings/', ProfileSettingsView.as_view(), name="profile-settings"),
    path('profile/password-update/',ChangePasswordView.as_view(),name='password-update'),
    path('users/<str:username>/follow/', follow_user, name='follow-user'),
    path('users/<str:username>/unfollow/', unfollow_user, name='unfollow-user'),
    path('users/<str:username>/is-following/', is_following, name='is-following'),
    path('users/<str:username>/followers/', followers_list, name='followers-list'),
    path('users/<str:username>/following/', following_list, name='following-list'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_URL)
