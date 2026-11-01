# SakhiVikas business recommendation system

## Requirements

- Node.js and npm for the React frontend
- Python 3.10 or newer for the FastAPI backend

The backend data and trained model are included under `recommendationmodel/data` and `recommendationmodel/model`.

## Start the backend (PowerShell)

```powershell
cd recommendationmodel
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m uvicorn api.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. Open `http://127.0.0.1:8000/docs` to inspect its endpoints. The health check is `http://127.0.0.1:8000/health`.

## Start the frontend (another PowerShell window)

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). To use a different backend URL, set `VITE_API_URL` in a `frontend/.env` file, for example:

```text
VITE_API_URL=http://127.0.0.1:8000
```

The current model accepts one skill per recommendation request, so the form asks you to choose one skill for matching.

