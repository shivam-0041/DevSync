import datetime as dt
import os
import random
import uuid

from locust import HttpUser, between, task


def _env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class DevSyncUser(HttpUser):
    wait_time = between(float(os.getenv("LOCUST_WAIT_MIN", "0.5")), float(os.getenv("LOCUST_WAIT_MAX", "2.0")))

    def on_start(self):
        self.enable_mutations = _env_bool("LOCUST_ENABLE_MUTATIONS", default=False)
        self.cover_known_broken = _env_bool("LOCUST_COVER_KNOWN_BROKEN", default=False)
        self.enable_register_coverage = _env_bool("LOCUST_ENABLE_REGISTER_COVERAGE", default=False)
        self.enable_file_upload = _env_bool("LOCUST_ENABLE_FILE_UPLOAD", default=False)
        self.enable_download = _env_bool("LOCUST_ENABLE_DOWNLOAD", default=False)

        self.is_authenticated = False
        self.refresh_token = None
        self.user_id = None
        self.username = None
        self.target_username = os.getenv("LOCUST_TARGET_USERNAME")
        self.follow_target_username = os.getenv("LOCUST_FOLLOW_TARGET")

        self.project_slugs = []
        self.project_whiteboards = {}
        self.temp_project_slug = None
        self.temp_folder_id = None
        self.temp_file_id = None
        self.latest_invite_id = None

        self._csrf_bootstrap()
        self._bootstrap_auth()
        if self.is_authenticated:
            self._bootstrap_profile()
            self._refresh_project_cache()

    def _request(self, method, path, *, name, expected=(200,), **kwargs):
        with self.client.request(method, path, name=name, catch_response=True, **kwargs) as response:
            if response.status_code in expected:
                response.success()
            else:
                body = (response.text or "")[:200]
                response.failure(f"{response.status_code} for {path}. body={body}")
            return response

    def _csrf_bootstrap(self):
        response = self._request(
            "GET",
            "/api/auth/csrf/",
            name="GET /api/auth/csrf/ (bootstrap)",
            expected=(200,),
        )
        if response.status_code == 200:
            csrf_token = self.client.cookies.get("csrftoken")
            if csrf_token:
                self.client.headers.update({"X-CSRFToken": csrf_token})

    def _bootstrap_auth(self):
        auth_token = os.getenv("AUTH_TOKEN")
        if auth_token:
            self.client.headers.update({"Authorization": f"Bearer {auth_token}"})
            self.is_authenticated = True
            return

        username = os.getenv("LOCUST_USERNAME")
        password = os.getenv("LOCUST_PASSWORD")
        if not username or not password:
            return

        response = self._request(
            "POST",
            "/api/auth/login/",
            name="POST /api/auth/login/",
            expected=(200,),
            json={"username": username, "password": password},
        )

        if response.status_code != 200:
            return

        data = response.json()
        token = data.get("access")
        if not token:
            return

        self.client.headers.update({"Authorization": f"Bearer {token}"})
        self.refresh_token = data.get("refresh")
        self.username = data.get("username")
        if not self.target_username:
            self.target_username = self.username
        self.is_authenticated = True

    def _bootstrap_profile(self):
        response = self._request(
            "GET",
            "/api/core/profile/",
            name="GET /api/core/profile/ (bootstrap)",
            expected=(200, 401),
        )
        if response.status_code != 200:
            return

        data = response.json()
        self.username = data.get("username") or self.username
        if not self.target_username:
            self.target_username = self.username

    def _refresh_project_cache(self):
        response = self._request(
            "GET",
            "/api/projects/list/",
            name="GET /api/projects/list/ (bootstrap)",
            expected=(200, 401),
        )
        if response.status_code != 200:
            return

        items = response.json()
        if not isinstance(items, list):
            return

        self.project_slugs = [item.get("slug") for item in items if item.get("slug")]
        self.project_whiteboards = {
            item.get("slug"): item.get("whiteboard_id")
            for item in items
            if item.get("slug") and item.get("whiteboard_id")
        }

    def _pick_slug(self):
        if self.temp_project_slug:
            return self.temp_project_slug
        if not self.project_slugs:
            self._refresh_project_cache()
        if not self.project_slugs:
            return None
        return random.choice(self.project_slugs)

    def _tomorrow(self):
        return (dt.date.today() + dt.timedelta(days=1)).isoformat()

    @task(6)
    def public_projects(self):
        self._request(
            "GET",
            "/api/projects/public/",
            name="GET /api/projects/public/",
            expected=(200,),
        )

    @task(2)
    def public_projects_by_user(self):
        if not self.target_username:
            return
        self._request(
            "GET",
            f"/api/projects/public/{self.target_username}/",
            name="GET /api/projects/public/:username/",
            expected=(200,),
        )

    @task(2)
    def auth_csrf(self):
        self._request(
            "GET",
            "/api/auth/csrf/",
            name="GET /api/auth/csrf/",
            expected=(200,),
        )

    @task(1)
    def auth_refresh_token(self):
        if not self.refresh_token:
            return
        response = self._request(
            "POST",
            "/api/auth/login/refresh",
            name="POST /api/auth/login/refresh",
            expected=(200,),
            json={"refresh": self.refresh_token},
        )
        if response.status_code == 200:
            data = response.json()
            new_token = data.get("access")
            if new_token:
                self.client.headers.update({"Authorization": f"Bearer {new_token}"})

    @task(2)
    def public_profile_routes(self):
        if not self.target_username:
            return
        username = self.target_username
        self._request(
            "GET",
            f"/api/core/users/{username}/",
            name="GET /api/core/users/:username/",
            expected=(200, 404),
        )
        self._request(
            "GET",
            f"/api/core/users/{username}/followers/",
            name="GET /api/core/users/:username/followers/",
            expected=(200, 404),
        )
        self._request(
            "GET",
            f"/api/core/users/{username}/following/",
            name="GET /api/core/users/:username/following/",
            expected=(200, 404),
        )
        self._request(
            "GET",
            f"/api/core/users/{username}/is-following/",
            name="GET /api/core/users/:username/is-following/",
            expected=(200, 404),
        )

    @task(3)
    def authenticated_profile(self):
        if not self.is_authenticated:
            return
        self._request(
            "GET",
            "/api/core/profile/",
            name="GET /api/core/profile/",
            expected=(200,),
        )
        self._request(
            "GET",
            "/api/core/profile/settings/",
            name="GET /api/core/profile/settings/",
            expected=(200,),
        )

    @task(4)
    def authenticated_project_reads(self):
        if not self.is_authenticated:
            return

        self._request("GET", "/api/projects/list/", name="GET /api/projects/list/", expected=(200,))
        self._request("GET", "/api/projects/teammates/", name="GET /api/projects/teammates/", expected=(200,))
        self._request("GET", "/api/projects/tasks/my/", name="GET /api/projects/tasks/my/", expected=(200,))

        slug = self._pick_slug()
        if not slug:
            return

        self._request("GET", f"/api/projects/{slug}/", name="GET /api/projects/:slug/", expected=(200, 403, 404))
        self._request("GET", f"/api/projects/{slug}/members/", name="GET /api/projects/:slug/members/", expected=(200, 403, 404))
        self._request("GET", f"/api/projects/{slug}/pending-invites/", name="GET /api/projects/:slug/pending-invites/", expected=(200, 403, 404))

        if self.enable_download:
            self._request(
                "GET",
                f"/api/projects/{slug}/files/download/",
                name="GET /api/projects/:slug/files/download/",
                expected=(200, 403, 404),
            )

    @task(1)
    def invitation_response_route(self):
        if not self.is_authenticated:
            return
        self._request(
            "POST",
            "/api/projects/invite/respond/?token=invalid&action=decline",
            name="POST /api/projects/invite/respond/",
            expected=(400,),
        )

    @task(1)
    def follow_routes(self):
        if not self.follow_target_username:
            return

        target = self.follow_target_username
        if self.enable_mutations and self.is_authenticated:
            self._request(
                "POST",
                f"/api/core/users/{target}/follow/",
                name="POST /api/core/users/:username/follow/",
                expected=(201, 400, 404),
            )
            self._request(
                "POST",
                f"/api/core/users/{target}/unfollow/",
                name="POST /api/core/users/:username/unfollow/",
                expected=(200, 400, 404),
            )

        self._request(
            "GET",
            f"/api/core/users/{target}/is-following/",
            name="GET /api/core/users/:username/is-following/ (follow target)",
            expected=(200, 404),
        )

    @task(1)
    def register_route_coverage(self):
        if not self.enable_register_coverage:
            return

        unique = uuid.uuid4().hex[:8]
        payload = {
            "first_name": "Locust",
            "last_name": "User",
            "username": f"locust_{unique}",
            "email": f"locust_{unique}@example.com",
            "password": "Locust#1234",
        }
        self._request(
            "POST",
            "/api/auth/register/",
            name="POST /api/auth/register/",
            expected=(201, 400),
            json=payload,
        )

    @task(2)
    def mutation_routes(self):
        if not self.enable_mutations or not self.is_authenticated:
            return

        slug = self._pick_slug()

        if not slug:
            project_name = f"locust-project-{uuid.uuid4().hex[:6]}"
            create_payload = {
                "name": project_name,
                "description": "Created by Locust mutation scenario",
                "visibility": "private",
                "template": "blank",
                "gitignore": "Python",
                "license": "MIT",
                "readme": True,
                "issues_enabled": True,
                "wiki_enabled": False,
                "boards_enabled": True,
                "discussions_enabled": True,
                "auto_init": True,
            }
            create_response = self._request(
                "POST",
                "/api/projects/create/",
                name="POST /api/projects/create/",
                expected=(201, 400),
                json=create_payload,
            )
            if create_response.status_code == 201:
                data = create_response.json()
                self.temp_project_slug = data.get("slug")
                slug = self.temp_project_slug
                self._refresh_project_cache()

        if not slug:
            return

        update_payload = {
            "name": f"locust-update-{uuid.uuid4().hex[:6]}",
            "description": "Locust update check",
            "visibility": "private",
        }
        self._request(
            "PUT",
            f"/api/projects/{slug}/update/",
            name="PUT /api/projects/:slug/update/",
            expected=(200, 400, 403, 404),
            json=update_payload,
        )

        issue_payload = {
            "title": f"Load issue {uuid.uuid4().hex[:5]}",
            "description": "Issue created by Locust",
            "status": "open",
            "issue_type": "bug_report",
            "priority": "medium",
            "labels": ["load"],
        }
        self._request(
            "POST",
            f"/api/projects/{slug}/issues/create/",
            name="POST /api/projects/:slug/issues/create/",
            expected=(201, 400, 403, 404),
            json=issue_payload,
        )

        task_payload = {
            "title": f"Load task {uuid.uuid4().hex[:5]}",
            "description": "Task created by Locust",
            "assign_to": self.user_id,
            "priority": "medium",
            "status": "to_do",
            "deadline": self._tomorrow(),
            "labels": ["load"],
            "dependencies": [],
        }
        self._request(
            "POST",
            f"/api/projects/{slug}/tasks/create/",
            name="POST /api/projects/:slug/tasks/create/",
            expected=(201, 400, 403, 404),
            json=task_payload,
        )

        create_folder_payload = {
            "name": f"locust-folder-{uuid.uuid4().hex[:4]}",
            "item_type": "folder",
            "branch": "main",
        }
        folder_response = self._request(
            "POST",
            f"/api/projects/{slug}/files/create/",
            name="POST /api/projects/:slug/files/create/ (folder)",
            expected=(201, 400, 403, 404),
            json=create_folder_payload,
        )
        if folder_response.status_code == 201:
            item = folder_response.json().get("item", {})
            self.temp_folder_id = item.get("id")

        create_file_payload = {
            "name": f"locust-file-{uuid.uuid4().hex[:4]}.txt",
            "item_type": "file",
            "branch": "main",
            "parent_id": self.temp_folder_id,
            "initial_content": "load test content",
        }
        file_response = self._request(
            "POST",
            f"/api/projects/{slug}/files/create/",
            name="POST /api/projects/:slug/files/create/ (file)",
            expected=(201, 400, 403, 404),
            json=create_file_payload,
        )
        if file_response.status_code == 201:
            item = file_response.json().get("item", {})
            self.temp_file_id = item.get("id")

        if self.temp_folder_id:
            self._request(
                "GET",
                f"/api/projects/{slug}/folder/{self.temp_folder_id}/",
                name="GET /api/projects/:slug/folder/:folder_id/",
                expected=(200, 403, 404),
            )

        if self.enable_file_upload:
            upload_name = f"upload-{uuid.uuid4().hex[:5]}.txt"
            self._request(
                "POST",
                f"/api/projects/{slug}/files/upload/",
                name="POST /api/projects/:slug/files/upload/",
                expected=(201, 400, 403, 404),
                files={"files": (upload_name, b"locust upload", "text/plain")},
                data={"branch": "main"},
            )

        invite_email = os.getenv("LOCUST_INVITE_EMAIL")
        if invite_email:
            invite_response = self._request(
                "POST",
                f"/api/projects/{slug}/invite/",
                name="POST /api/projects/:slug/invite/",
                expected=(201, 400, 403, 404),
                json={"email": invite_email, "role": "developer"},
            )
            if invite_response.status_code == 201:
                self._request(
                    "GET",
                    f"/api/projects/{slug}/pending-invites/",
                    name="GET /api/projects/:slug/pending-invites/ (after invite)",
                    expected=(200, 403, 404),
                )

        if self.temp_file_id:
            self._request(
                "DELETE",
                f"/api/projects/{slug}/files/{self.temp_file_id}/delete/",
                name="DELETE /api/projects/:slug/files/:file_id/delete/",
                expected=(200, 400, 403, 404),
                json={"file_name": create_file_payload["name"]},
            )

    @task(1)
    def broken_route_coverage(self):
        if not self.cover_known_broken or not self.is_authenticated:
            return

        slug = self._pick_slug()
        if not slug:
            return

        whiteboard_id = self.project_whiteboards.get(slug, "missing")
        self._request(
            "GET",
            f"/api/projects/{slug}/whiteboard/{whiteboard_id}/",
            name="GET /api/projects/:slug/whiteboard/:whiteboard_id/",
            expected=(200, 404, 500),
        )
        self._request(
            "PUT",
            f"/api/projects/{slug}/whiteboard/{whiteboard_id}/update/",
            name="PUT /api/projects/:slug/whiteboard/:whiteboard_id/update/",
            expected=(200, 400, 404, 500),
            json={"data": {"items": []}},
        )

        # URL pattern currently takes slug but view lookup expects project_id.
        self._request(
            "DELETE",
            f"/api/projects/{slug}/delete/",
            name="DELETE /api/projects/:slug/delete/",
            expected=(204, 403, 404),
        )