from pathlib import Path

import joblib
import pandas as pd


BASE_DIR = Path(__file__).resolve().parents[1]
TRAINING_DATA_PATH = BASE_DIR / "data" / "training_data.csv"
BUSINESS_DATA_PATH = BASE_DIR / "data" / "business_recommendation_dataset.csv"
MODEL_PATH = BASE_DIR / "model" / "recommender.pkl"

for path in (TRAINING_DATA_PATH, BUSINESS_DATA_PATH, MODEL_PATH):
    if not path.is_file():
        raise FileNotFoundError(f"Required recommendation file not found: {path}")

businesses = pd.read_csv(BUSINESS_DATA_PATH)
model = joblib.load(MODEL_PATH)

required_business_columns = {
    "business", "min_investment", "max_investment", "required_time",
    "skill", "land_required", "demand",
}
missing_columns = required_business_columns - set(businesses.columns)
if missing_columns:
    raise ValueError(f"Missing columns in business dataset: {sorted(missing_columns)}")


def generate_reasons(user, business):
    reasons = []
    if business["min_investment"] <= user["investment"] <= business["max_investment"]:
        reasons.append("Your investment fits the estimated investment range.")
    if str(user["skill"]).strip().lower() == str(business["skill"]).strip().lower():
        reasons.append("Your skill matches the required skill.")
    if user["available_time"] >= business["required_time"]:
        reasons.append("Your available time is sufficient.")
    if business["land_required"] == 0:
        reasons.append("This business does not require land.")
    if business["demand"] >= 4:
        reasons.append("The dataset indicates high demand.")
    if not reasons:
        reasons.append("This business was selected based on the model's ranking.")
    return reasons


def recommend(user):
    if businesses.empty:
        return []

    candidate_rows = []
    for _, business in businesses.iterrows():
        candidate = business.to_dict()
        candidate.update(user)
        candidate_rows.append(candidate)
    features = pd.DataFrame(candidate_rows)

    if hasattr(model, "feature_names_in_"):
        model_features = list(model.feature_names_in_)
    else:
        model_features = [
            "investment", "available_time", "skill", "land", "experience", "business"
        ]
    missing_features = set(model_features) - set(features.columns)
    if missing_features:
        raise ValueError(f"Model input features are missing: {sorted(missing_features)}")

    predictions = model.predict(features[model_features])
    ranked = businesses.copy()
    ranked["_prediction"] = predictions
    ranked = ranked.sort_values("_prediction", ascending=False).drop_duplicates("business").head(5)

    return [
        {
            "business": str(row["business"]),
            "reasons": generate_reasons(user, row),
        }
        for _, row in ranked.iterrows()
    ]
