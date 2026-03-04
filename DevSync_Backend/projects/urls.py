from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.CreateProjectView.as_view(), name="create-project"),
    path("list/", views.ProjectListView.as_view(), name="project-list"),
    path("public/<str:username>/", views.PublicProjectListView.as_view(), name="public-project-list"),
    path("tasks/my/", views.MyAssignedTasksView.as_view(), name="my-assigned-tasks"),
    path("<slug:slug>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path("<slug:slug>/update/", views.ProjectUpdateView.as_view(), name="project-update"),
    path("<slug:slug>/delete/", views.ProjectDeleteView.as_view(), name="project-delete"),
    path("<slug:slug>/issues/create/", views.IssueCreateView.as_view(), name="create-issue"),
    path("<slug:slug>/tasks/create/", views.TasksCreateView.as_view(),name="task-create"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/", views.get_whiteboard, name="get_whiteboard"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/update/", views.update_whiteboard, name="update_whiteboard"),
    
    # Project Invite endpoints
    path("<slug:slug>/invite/", views.send_project_invite, name="send-project-invite"),
    path("invite/respond/", views.respond_to_invite, name="respond_to_invite"),
    
    # Project Members and Invites endpoints
    path("<slug:slug>/members/", views.get_project_members, name="get-project-members"),
    path("<slug:slug>/pending-invites/", views.get_pending_invites, name="get-pending-invites"),
]