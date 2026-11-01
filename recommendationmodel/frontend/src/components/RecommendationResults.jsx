import { ArrowLeft, BadgeCheck, Banknote, Lightbulb, ListChecks, AlertTriangle } from "lucide-react";

function money(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number)) return String(value);
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
}

function firstValue(item, keys) {
  for (const key of keys) if (item?.[key] !== undefined && item?.[key] !== null) return item[key];
  return undefined;
}

function listValue(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) return [value];
  return [];
}

export default function RecommendationResults({ t, results, status, error, onRetry, onEdit }) {
  if (status === "loading") {
    return <section className="state-card" aria-live="polite"><div className="loader-orbit"><span /></div><h1>{t("loadingTitle")}</h1><p className="muted">{t("loadingBody")}</p></section>;
  }

  if (status === "error") {
    return <section className="state-card error-state" role="alert"><span className="state-icon"><AlertTriangle size={25} /></span><h1>{t("errorTitle")}</h1><p className="muted">{t("errorBody")}</p>{error && <p className="technical-error">{error}</p>}<div className="state-actions"><button className="button button-secondary" onClick={onEdit}>{t("editProfile")}</button><button className="button button-primary" onClick={onRetry}>{t("tryAgain")}</button></div></section>;
  }

  if (!results.length) {
    return <section className="state-card"><span className="state-icon"><Lightbulb size={25} /></span><h1>{t("emptyTitle")}</h1><p className="muted">{t("emptyBody")}</p><button className="button button-primary" onClick={onEdit}>{t("editProfile")}</button></section>;
  }

  const visibleResults = results.slice(0, 5);

  return (
    <section className="results-section">
      <div className="results-heading">
        <div><p className="eyebrow">{t("matchesEyebrow")}</p><h1>{t("resultsTitle")}</h1><p className="muted">{t("resultsSubtitle")}</p></div>
        <button className="button button-secondary" onClick={onEdit}><ArrowLeft size={16} /> {t("editProfile")}</button>
      </div>
      <div className="recommendation-scroll" aria-label={t("resultsTitle")}>
        <div className="recommendation-grid">
        {visibleResults.map((item, index) => {
          const name = firstValue(item, ["business", "name", "title", "business_name"]) || `Business idea ${index + 1}`;
          const description = firstValue(item, ["description", "summary", "overview"]);
          const investment = firstValue(item, ["estimated_investment_inr", "estimated_cost", "investment", "startup_cost"]);
          const rawReason = firstValue(item, ["reasons", "why_it_matches", "reason", "match_reason", "why_recommended"]);
          const reason = Array.isArray(rawReason) ? rawReason.join(" ") : rawReason || description || t("genericMatchReason");
          const requirements = listValue(firstValue(item, ["requirements", "resources", "what_you_need"]));
          const challenges = listValue(firstValue(item, ["challenges", "risks", "considerations"]));
          return (
            <article className="recommendation-card" key={item.id || `${name}-${index}`}>
              <div className="recommendation-topline"><span className="recommendation-number">0{index + 1}</span><span className="match-badge"><BadgeCheck size={14} /> {t("whyMatches")}</span></div>
              <h2>{name}</h2>
              {description && <p className="recommendation-description">{description}</p>}
              {investment !== undefined && <div className="investment-box"><Banknote size={19} /><div><small>{t("estimatedInvestment")}</small><strong>{money(investment) || investment}</strong></div></div>}
              {reason && <div className="result-detail"><h3><Lightbulb size={15} /> {t("whyMatches")}</h3><p>{reason}</p></div>}
              {requirements.length > 0 && <div className="result-detail"><h3><ListChecks size={15} /> {t("requirements")}</h3><ul>{requirements.map((value, i) => <li key={i}>{value}</li>)}</ul></div>}
              {challenges.length > 0 && <div className="result-detail"><h3><AlertTriangle size={15} /> {t("challenges")}</h3><ul>{challenges.map((value, i) => <li key={i}>{value}</li>)}</ul></div>}
            </article>
          );
        })}
        </div>
      </div>
      <p className="results-count">{t("showingRecommendations", { count: visibleResults.length })}</p>
      <p className="disclaimer">{t("indicativeNote")}</p>
    </section>
  );
}



