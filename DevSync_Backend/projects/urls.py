from django.urls import path
from . import views

urlpatterns = [

    #Project endpoints
    path("create/", views.CreateProjectView.as_view(), name="create-project"),
    path("list/", views.ProjectListView.as_view(), name="project-list"),
    path("teammates/", views.get_dashboard_teammates, name="dashboard-teammates"),
    path("public/", views.AllPublicProjectListView.as_view(), name="all-public-project-list"),
    path("public/<str:username>/", views.PublicProjectListView.as_view(), name="public-project-list"),
    path("tasks/my/", views.MyAssignedTasksView.as_view(), name="my-assigned-tasks"),
    path("tasks/<str:task_id>/update-status/", views.update_task_status, name="update-task-status"),

    # Notification endpoints
    path('notifications/', views.list_notifications, name='list-notifications'),
    path('notifications/<int:notification_id>/read/', views.mark_notification_read, name='mark-notification-read'),
    path('notifications/read-all/', views.mark_all_notifications_read, name='mark-all-notifications-read'),

    # Public project detail — no auth required, only public projects
    path("view/<str:username>/<slug:slug>/", views.PublicProjectDetailView.as_view(), name="public-project-detail"),

    path("<slug:slug>/", views.ProjectDetailView.as_view(), name="project-detail"),
    path("<slug:slug>/update/", views.ProjectUpdateView.as_view(), name="project-update"),
    path("<slug:slug>/delete/", views.ProjectDeleteView.as_view(), name="project-delete"),
    path("<slug:slug>/issues/create/", views.IssueCreateView.as_view(), name="create-issue"),
    path("<slug:slug>/tasks/create/", views.TasksCreateView.as_view(),name="task-create"),

    #Whiteboard endpoints
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/", views.get_whiteboard, name="get_whiteboard"),
    path("<slug:slug>/whiteboard/<str:whiteboard_id>/update", views.update_whiteboard, name="update_whiteboard"),
    
    
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
    
    # Discussion endpoints
    path("<slug:slug>/discussions/", views.list_discussion_threads, name="list-discussions"),
    path("<slug:slug>/discussions/create/", views.create_discussion_thread, name="create-discussion"),
    path("<slug:slug>/discussions/<int:thread_id>/", views.discussion_thread_detail, name="discussion-detail"),
    path("<slug:slug>/discussions/<int:thread_id>/close/", views.close_discussion_thread, name="close-discussion"),
    path("<slug:slug>/discussions/<int:thread_id>/comments/", views.list_discussion_comments, name="list-comments"),
    path("<slug:slug>/discussions/<int:thread_id>/comments/create/", views.create_discussion_comment, name="create-comment"),
    path("<slug:slug>/discussions/<int:thread_id>/comments/<int:comment_id>/", views.update_delete_discussion_comment, name="update-delete-comment"),
    
    # Pull Request endpoints
    path('<slug:slug>/pull-requests/', views.list_pull_requests, name='list-pull-requests'),
    path('<slug:slug>/pull-requests/create/', views.create_pull_request, name='create-pull-request'),
    path('<slug:slug>/pull-requests/<int:pr_id>/', views.get_pull_request, name='get-pull-request'),

    # Star / Unstar endpoints
    path('<slug:slug>/star/', views.toggle_star_project, name='toggle-star-project'),
]