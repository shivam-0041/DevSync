from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.CreateProjectView.as_view(), name="create-project"),
    path("list/", views.ProjectListView.as_view(), name="project-list"),
    path("<slug:slug>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path("<slug:slug>/update/", views.ProjectUpdateView.as_view(), name="project-update"),
    path("<slug:slug>/delete/", views.ProjectDeleteView.as_view(), name="project-delete"),
    path("<slug:slug>/issues/create/", views.IssueCreateView.as_view(), name="create-issue"),
    path("<slug:slug>/tasks/create/", views.TasksCreateView.as_view(),name="task-create"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/", views.get_whiteboard, name="get_whiteboard"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/update/", views.update_whiteboard, name="update_whiteboard"),
   
]