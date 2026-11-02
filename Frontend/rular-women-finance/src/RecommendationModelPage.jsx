import "./RecommendationModelPage.css";

const recommendationAppUrl = (
  import.meta.env.VITE_RECOMMENDATION_FRONTEND_URL || "http://localhost:5174"
).replace(/\/$/, "");

export default function RecommendationModelPage({ language = "en" }) {
  const recommendationUrl = new URL(recommendationAppUrl);
  recommendationUrl.searchParams.set("lang", language);

  return (
    <main className="recommendation-model-page">
      <iframe
        className="recommendation-model-frame"
        src={recommendationUrl.toString()}
        title="Business recommendation model"
        loading="lazy"
      />
    </main>
  );
}
