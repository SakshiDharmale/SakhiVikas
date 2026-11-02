const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const skillIds = {
  Cooking: "cooking",
  Tailoring: "tailoring",
  Farming: "farming",
  "Animal husbandry": "animal_husbandry",
  Crafts: "craft",
  "Technical work": "technical",
  Retail: "retail",
  "Beauty services": "beauty",
  Machinery: "machinery",
};

const experienceLevels = { Beginner: 0, Intermediate: 2, Experienced: 5 };

export async function getRecommendations(profile) {
  const selectedSkill = profile.skills?.[0];
  if (!selectedSkill || !skillIds[selectedSkill]) {
    throw new Error("Choose a supported skill before requesting recommendations.");
  }

  const payload = {
    investment: profile.budget_inr,
    available_time: profile.available_hours_per_day,
    skill: skillIds[selectedSkill],
    land: profile.land_available ? 1 : 0,
    experience: experienceLevels[profile.experience] ?? 0,
    language: profile.language,
  };

  const response = await fetch(`${API_URL}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`The recommendation API returned an invalid response (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    const detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail ?? data);
    throw new Error(detail || `Recommendation request failed (HTTP ${response.status}).`);
  }
  if (!Array.isArray(data.recommendations)) {
    throw new Error("The recommendation API response did not include a recommendations list.");
  }
  return data.recommendations;
}
