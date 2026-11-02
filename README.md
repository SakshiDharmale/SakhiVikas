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

Open the URL Vite prints and visit Business Recommendations after selecting a language. That route shows the recommendation model's own frontend, embedded in the main app. The recommendation frontend sends profile details to the FastAPI `POST /recommend` endpoint and displays the model's ranked businesses and reasons.

The Business Recommendations route embeds the original recommendation model frontend. Start that Vite app in another terminal:

```powershell
cd recommendationmodel/frontend
npm install
npm run dev -- --port 5174
```

Its frontend calls the FastAPI service on port 8000. Set `VITE_API_URL=http://127.0.0.1:8000` in `recommendationmodel/frontend/.env` if needed. In the main frontend, `VITE_RECOMMENDATION_FRONTEND_URL` selects the embedded frontend URL (default `http://localhost:5174`).

To change the embedded recommendation frontend URL, copy `.env.example` to `.env` inside `Frontend/rular-women-finance` and edit `VITE_RECOMMENDATION_FRONTEND_URL`. Configure `VITE_API_URL` in `recommendationmodel/frontend/.env` for the recommendation API. For deployment, serve the recommendation frontend and API over HTTPS and allow the API to receive requests from the recommendation frontend origin in `recommendationmodel/api/main.py` CORS settings.

## Run the finance backend

```powershell
cd Backend
npm install
npm start
```

Configure the existing MySQL and authentication environment variables locally before using finance and login features. The recommendation service runs independently of the finance backend.

Python environments, dependency folders, build output, and local environment configuration should not be uploaded to GitHub. The original recommendation project remains unchanged.
