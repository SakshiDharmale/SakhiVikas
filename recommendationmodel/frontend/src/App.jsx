import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Sparkles } from "lucide-react";
import Navbar from "./components/Navbar.jsx";
import ProfileForm from "./components/ProfileForm.jsx";
import RecommendationResults from "./components/RecommendationResults.jsx";
import { getRecommendations } from "./services/recommendationApi.js";

export default function App() {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle");
  const [apiError, setApiError] = useState("");

  const requestRecommendations = useCallback(async (nextProfile) => {
    setProfile(nextProfile);
    setPage("results");
    setStatus("loading");
    setApiError("");
    setResults([]);
    try {
      const response = await getRecommendations({ ...nextProfile, language: i18n.language });
      setResults(response);
      setStatus("success");
    } catch (error) {
      setApiError(error?.message || "Unknown error");
      setStatus("error");
    }
  }, [i18n.language]);

  const retry = () => profile && requestRecommendations(profile);

  return (
    <div className="app-shell" id="top">
      <div className="ambient-shape ambient-peach" />
      <div className="ambient-shape ambient-pink" />
      <Navbar t={t} />

      {page === "profile" && (
        <>
          <main className="welcome-layout">
            <section className="welcome-copy">
              <div className="eyebrow"><Sparkles size={14} /> {t("welcomeEyebrow")}</div>
              <h1>{t("welcomeTitle")}</h1>
              <p className="welcome-description">{t("welcomeBody")}</p>
              <ul className="benefit-list">
                <li><CheckCircle2 size={18} /> {t("welcomePoint1")}</li>
                <li><CheckCircle2 size={18} /> {t("welcomePoint2")}</li>
                <li><CheckCircle2 size={18} /> {t("welcomePoint3")}</li>
              </ul>
              <div className="welcome-note"><span className="note-icon"><Sparkles size={18} /></span><span>{t("tagline")}</span></div>
            </section>
            <div className="abstract-art" aria-hidden="true">
              <div className="art-sun" />
              <div className="art-arch art-arch-back" />
              <div className="art-arch art-arch-front" />
              <div className="art-leaf leaf-one" />
              <div className="art-leaf leaf-two" />
              <div className="art-dot dot-one" />
              <div className="art-dot dot-two" />
              <div className="art-caption">GROW AT YOUR OWN PACE</div>
            </div>
          </main>
          <ProfileForm t={t} onSubmit={requestRecommendations} isLoading={status === "loading"} />
        </>
      )}

      {page === "results" && (
        <main className="results-main">
          <RecommendationResults t={t} results={results} status={status} error={status === "error" ? apiError : ""} onRetry={retry} onEdit={() => { setPage("profile"); setStatus("idle"); }} />
        </main>
      )}

      <footer className="site-footer"><span className="footer-mark"><Sparkles size={14} /></span>{t("footer")}</footer>
    </div>
  );
}
