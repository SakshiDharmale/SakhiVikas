import logging
from pathlib import Path
from typing import Any

import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

app = FastAPI(
    title="Business Recommendation API",
    description="API for the business recommendation model",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", "http://127.0.0.1:5173",
        "http://localhost:5174", "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

SRC_DIR = Path(__file__).resolve().parents[1] / "src"
if str(SRC_DIR) not in __import__("sys").path:
    __import__("sys").path.insert(0, str(SRC_DIR))

try:
    from recommend import recommend as recommend_businesses
except Exception as exc:
    raise RuntimeError(f"Could not import the recommendation model: {exc}") from exc


class UserInput(BaseModel):
    investment: float = Field(gt=0)
    available_time: float = Field(gt=0, le=24)
    skill: str = Field(min_length=1, max_length=100)
    land: int = Field(ge=0, le=1)
    experience: int = Field(ge=0, le=50)


def make_json_safe(result: Any) -> Any:
    if isinstance(result, pd.DataFrame):
        result = result.to_dict(orient="records")
    elif isinstance(result, pd.Series):
        result = result.to_list()
    return jsonable_encoder(result)


@app.get("/")
def home():
    return {"message": "Business Recommendation API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommend")
def recommend_endpoint(user: UserInput):
    try:
        result = recommend_businesses(user.model_dump()) or []
        if not isinstance(result, (pd.DataFrame, list, tuple)):
            raise TypeError("The recommendation model returned an unsupported result.")
        return {
            "success": True,
            "count": len(result),
            "recommendations": make_json_safe(result),
        }
    except Exception as exc:
        logger.exception("Recommendation generation failed")
        raise HTTPException(status_code=500, detail="Recommendation generation failed.") from exc
