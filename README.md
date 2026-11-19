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

For a local frontend using a deployed recommendation API, create `Frontend/rular-women-finance/.env` with `VITE_RECOMMENDATION_API_URL=https://your-recommender.onrender.com`, then restart Vite. The repository's local `.env` points to `https://sakhivikas-ml.onrender.com`. The API must allow the local frontend origin (`http://localhost:5173` or `http://127.0.0.1:5173`) through CORS; these origins are included by default in `recommendationmodel/api/main.py`.

For Render, deploy the frontend as a Static Site with root directory `Frontend/rular-women-finance`, build command `npm ci && npm run build`, and publish directory `dist`. Set `VITE_API_BASE_URL` to the Express service URL and `VITE_RECOMMENDATION_API_URL` to the FastAPI service URL in the Static Site's **Build & Deploy > Environment** settings. The recommendation URL must be the API service's public HTTPS origin only, such as `https://your-recommender.onrender.com` (no `/recommend` suffix). Then trigger a new frontend deploy; Vite embeds these values at build time.

Deploy `recommendationmodel` as its own Render **Web Service** with root directory `recommendationmodel`, runtime **Python**, build command `pip install -r requirements.txt`, and start command `uvicorn api.main:app --host 0.0.0.0 --port $PORT`. Add `ALLOWED_ORIGINS` to this service's environment and set it to the exact public frontend origin, for example `https://your-frontend.onrender.com` (no path or trailing slash). After the API deploy is live, verify `https://your-recommender.onrender.com/health` returns `{"status":"ok"}`. If you change `ALLOWED_ORIGINS`, redeploy the API; if you change `VITE_RECOMMENDATION_API_URL`, rebuild and redeploy the frontend.

## Run the finance backend

```powershell
cd Backend
npm install
npm start
```

Configure the existing MySQL and authentication environment variables locally before using finance and login features. The recommendation service runs independently of the finance backend.

Python environments, dependency folders, build output, and local environment configuration should not be uploaded to GitHub. The recommendation UI is integrated into the main frontend; `recommendationmodel` contains the API and model files.
