from django.urls import path
from . import views

urlpatterns = [
    path('devsync/<str:username>/<slug:slug>/', views.ProjectDetailView.as_view(), name='project-detail'),
]
