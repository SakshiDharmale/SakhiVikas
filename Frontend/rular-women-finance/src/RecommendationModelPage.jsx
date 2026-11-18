import RecommendationApp from "./recommendation/App.jsx";
import "./recommendation/styles.css";

export default function RecommendationModelPage({ language = "en" }) {
  return <RecommendationApp language={language} />;
}
