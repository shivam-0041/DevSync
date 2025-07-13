from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.CreateProjectView.as_view(), name="create-project"),
    path("list/", views.ProjectListView.as_view(), name="project-list"),
    path("<str:project_id>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path("<str:project_id>/update/", views.ProjectUpdateView.as_view(), name="project-update"),
    path("<str:project_id>/delete/", views.ProjectDeleteView.as_view(), name="project-delete"),
]