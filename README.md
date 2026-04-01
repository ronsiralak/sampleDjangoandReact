# sampleDjangoandReact

A sample project using Django as the API backend and React + TypeScript as the frontend.

## Project Structure

```
.
├── manage.py          # Django management script
├── requirements.txt   # Python dependencies
├── backend/           # Django project settings
├── api/               # Django REST API app (Items CRUD)
└── frontend/          # React + TypeScript (Vite) app
```

## Backend (Django)

### Setup

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/items/`.

### Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/items/` | List all items |
| POST | `/api/items/` | Create a new item |
| GET | `/api/items/{id}/` | Retrieve an item |
| PUT | `/api/items/{id}/` | Update an item |
| DELETE | `/api/items/{id}/` | Delete an item |

## Frontend (React + TypeScript)

### Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

Make sure the Django backend is running before starting the frontend.
