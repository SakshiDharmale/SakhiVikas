# SakhiVikas

SakhiVikas combines the React finance app, Express finance backend, and Python business recommendation model in one repository.

## Run the recommendation API (PowerShell)

```powershell
cd recommendationmodel
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn api.main:app --reload --port 8000
```

The included `data/` and `model/recommender.pkl` files are required. API documentation: http://127.0.0.1:8000/docs. Health check: `/health`.

## Run the SakhiVikas frontend

In another terminal:

```powershell
cd Frontend/rular-women-finance
npm install
npm run dev
```

Open the URL Vite prints and visit Business Recommendations after selecting a language. The form sends investment, daily hours, one skill, land availability and experience to `POST /recommend`, then displays the model's ranked businesses and reasons. Other profile fields are currently not used by the model. Model-generated business names and reasons are currently in English.

To change the recommendation API URL, copy `.env.example` to `.env` inside `Frontend/rular-women-finance` and edit `VITE_RECOMMENDATION_API_URL`. For a deployed frontend, configure its origin in `recommendationmodel/api/main.py` CORS settings and use an HTTPS API URL.

## Run the finance backend

```powershell
cd Backend
npm install
npm start
```

Configure the existing MySQL and authentication environment variables locally before using finance and login features. The recommendation service runs independently of the finance backend.

Python environments, dependency folders, build output, and local environment configuration should not be uploaded to GitHub. The original recommendation project remains unchanged.
