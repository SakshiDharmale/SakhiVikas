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

Open the URL Vite prints and visit Business Recommendations after selecting a language. That route uses the recommendation UI inside the main React app and sends profile details to the FastAPI `POST /recommend` endpoint.

For local development, copy `.env.example` to `.env` in `Frontend/rular-women-finance` if your APIs use non-default URLs. Start the FastAPI service in another terminal using the commands above; the main frontend calls `http://127.0.0.1:8000` by default.

For Render, deploy the main frontend as one Static Site with root directory `Frontend/rular-women-finance`, build command `npm ci && npm run build`, and publish directory `dist`. Set `VITE_API_BASE_URL` to the Express service URL and `VITE_RECOMMENDATION_API_URL` to the FastAPI service URL in that Static Site's environment settings. Set `ALLOWED_ORIGINS` on the FastAPI service to the main frontend's Render URL, then redeploy the API. Vite environment variables are applied during the frontend build, so redeploy the Static Site after changing them.

## Run the finance backend

```powershell
cd Backend
npm install
npm start
```

Configure the existing MySQL and authentication environment variables locally before using finance and login features. The recommendation service runs independently of the finance backend.

Python environments, dependency folders, build output, and local environment configuration should not be uploaded to GitHub. The recommendation UI is integrated into the main frontend; `recommendationmodel` contains the API and model files.
