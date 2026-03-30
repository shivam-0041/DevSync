from datetime import timedelta

from django.utils.timezone import now


class UpdateLastActivityMiddleware:
    """Update authenticated user's activity timestamp with light throttling."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = getattr(request, "user", None)
        if user and user.is_authenticated and request.path.startswith("/api/"):
            last_activity = getattr(user, "last_activity", None)
            current_time = now()
            if not last_activity or (current_time - last_activity) >= timedelta(minutes=2):
                user.last_activity = current_time
                user.save(update_fields=["last_activity"])

        return self.get_response(request)
