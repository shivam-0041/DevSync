from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.CreateProjectView.as_view(), name="create-project"),
    path("list/", views.ProjectListView.as_view(), name="project-list"),
    path("teammates/", views.get_dashboard_teammates, name="dashboard-teammates"),
    path("public/", views.AllPublicProjectListView.as_view(), name="all-public-project-list"),
    path("public/<str:username>/", views.PublicProjectListView.as_view(), name="public-project-list"),
    path("tasks/my/", views.MyAssignedTasksView.as_view(), name="my-assigned-tasks"),
    path("<slug:slug>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path("<slug:slug>/update/", views.ProjectUpdateView.as_view(), name="project-update"),
    path("<slug:slug>/delete/", views.ProjectDeleteView.as_view(), name="project-delete"),
    path("<slug:slug>/issues/create/", views.IssueCreateView.as_view(), name="create-issue"),
    path("<slug:slug>/tasks/create/", views.TasksCreateView.as_view(),name="task-create"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/", views.get_whiteboard, name="get_whiteboard"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/update/", views.update_whiteboard, name="update_whiteboard"),
    
    # File upload endpoint
    path("<slug:slug>/files/upload/", views.upload_files, name="upload-files"),
    path("<slug:slug>/files/create/", views.create_project_item, name="create-project-item"),
    path("<slug:slug>/files/<int:file_id>/delete/", views.delete_file, name="delete-file"),
    path("<slug:slug>/files/download/", views.download_files, name="download-files"),
    path("<slug:slug>/folder/<int:folder_id>/", views.get_folder_contents, name="get-folder-contents"),
    
    # Project Invite endpoints
    path("<slug:slug>/invite/", views.send_project_invite, name="send-project-invite"),
    path("invite/respond/", views.respond_to_invite, name="respond_to_invite"),
    
    # Project Members and Invites endpoints
    path("<slug:slug>/members/", views.get_project_members, name="get-project-members"),
    path("<slug:slug>/pending-invites/", views.get_pending_invites, name="get-pending-invites"),
    path("<slug:slug>/pending-invites/<int:invite_id>/cancel/", views.cancel_pending_invite, name="cancel-pending-invite"),
]