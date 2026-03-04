# DevSync (Under development) ⚠️

> **Under development:** This repository is a work in progress. Expect breaking changes and incomplete features.

---

## What is DevSync? 💡
DevSync is a collaborative code and project platform that provides project repositories, issues, tasks, pull-request-like workflows, a project whiteboard, and chat. The backend is a Django REST API and the frontend is a Vite + React + TypeScript app.

## Architecture & Tech Stack 🔧
- **Backend:** Django (REST API), apps include `authentication`, `projects`, `chats`, `notification` (`DevSync_Backend/`).
- **Frontend:** React + TypeScript + Vite (`DevSync_Frontend/`).
- **Local DB:** SQLite for development (no extra DB setup required).

---

## Quick start — Development 🚀
### Prerequisites
- Python 3.11+ (or the version in `myenv/`)
- Node.js >= 18 and npm (or yarn/pnpm)
- Git

### Backend (API)
```bash
cd DevSync_Backend
python -m venv venv
source venv/bin/activate
pip install -r ../backend_requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver 0.0.0.0:8000
```
The API is available at `http://127.0.0.1:8000/`.

### Frontend (Client)
```bash
cd DevSync_Frontend
npm install
npm run dev   # visit http://localhost:5173
```

---

## Environment & Secrets 🔒
> **Security note:** Do NOT commit secrets to the repository.

- Use a local `.env` file and keep `.env` in `.gitignore`.
- Required environment variables (example):
  - `DJANGO_SECRET_KEY` — **required** in production (will raise if missing when `DEBUG=False`).
  - `DJANGO_DEBUG` — set to `False` in production.
  - `DATABASE_URL` (if switching from SQLite), `EMAIL_HOST_PASSWORD`, `SOCIAL_GITHUB_CLIENT_ID`, `SOCIAL_GITHUB_SECRET`.

Example to create a local `.env`:
```bash
cp .env.example .env
# generate a secret key (recommended)
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
# then set DJANGO_SECRET_KEY in .env
```
If secrets were accidentally committed previously, rotate them immediately and consider purging them from Git history.

---

## Testing & Linting ✅
- Backend tests: `cd DevSync_Backend && python manage.py test`
- Frontend lint: `cd DevSync_Frontend && npm run lint`


---

✨
