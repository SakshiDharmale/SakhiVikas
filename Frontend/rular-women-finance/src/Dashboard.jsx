
import {
  ArrowRight,
  Wallet,
  Lightbulb,
  Store,
  CircleDollarSign,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { T } from "./data";
import "./Dashboard.css";

export default function Dashboard({ language }) {
  const t = T[language] || T.en;
  const navigate = useNavigate();

  const cards = [
    {
      key: "expense",
      icon: Wallet,
      title: t.expenseTrackerTitle,
      desc: t.expenseTrackerDesc,
      footer: t.dashboardExpenseFooter || "Quick Logging",
      detail: t.dashboardExpenseDetail || "Track Your Savings",
      path: "/expense-tracker",
    },
    {
      key: "recommendation",
      icon: Lightbulb,
      title: t.recommendationSystem,
      desc: t.recommendationSystemDesc,
      footer: t.dashboardBusinessFooter || "Filter by Budget",
      detail: t.dashboardBusinessDetail || "Business Ideas",
      path: "/business-recommendations",
    },
    {
      key: "business-info",
      icon: Store,
      title: t.businessInfoTitle,
      desc: t.businessInfoDesc,
      footer: t.dashboardInfoFooter || "Step-by-Step Guides",
      detail: t.dashboardInfoDetail || "Startup Information",
      path: "/business-info",
    },
    {
      key: "financial-advisor",
      icon: CircleDollarSign,
      title: t.financialAdviceTitle,
      desc: t.financialAdviceDesc,
      footer: t.dashboardAdviceFooter || "Financial Planning",
      detail: t.dashboardAdviceDetail || "Savings & Schemes",
      path: "/financial-advisor",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-brand">
            <div className="dashboard-logo">स</div>

            <div className="dashboard-brand-text">
              <h2 className="dashboard-brand-title">
                SakhiVikas
              </h2>

              <span className="dashboard-brand-subtitle">
                {t.dashboardBrandSubtitle ||
                  "Women Entrepreneurship Portal"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dashboard-container">
        {/* WELCOME BANNER */}
        <section className="dashboard-hero">
          <div className="dashboard-hero-content">
            <h1 className="dashboard-hero-heading">
              {t.dashboardTitle}
            </h1>

            <h2 className="dashboard-hero-tagline">
              {t.dashboardSubtitle}
            </h2>

            <p className="dashboard-hero-desc">
              {t.dashboardWelcomeDesc}
            </p>
          </div>
        </section>

        {/* FOUR DASHBOARD OPTIONS */}
        <section className="dashboard-options">
          <div className="dashboard-section-heading">
            <h2>
              {t.dashboardExploreTitle ||
                "Explore Your Options"}
            </h2>

            <p>
              {t.dashboardExploreDesc ||
                "Choose a service to get started."}
            </p>
          </div>

          <div className="dashboard-grid">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <button
                  type="button"
                  key={card.key}
                  className="dashboard-card"
                  onClick={() => navigate(card.path)}
                >
                  <div className="dashboard-card-header">
                    <div className="dashboard-card-icon">
                      <Icon size={23} />
                    </div>

                    <div className="dashboard-card-arrow">
                      <ArrowRight size={19} />
                    </div>
                  </div>

                  <div className="dashboard-card-content">
                    <h3>{card.title}</h3>
                    <p>{card.desc}</p>
                  </div>

                  <div className="dashboard-card-footer">
                    <span>{card.footer}</span>
                    <strong>{card.detail}</strong>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          <p>
            {t.dashboardFooter ||
              "SakhiVikas — Supporting women towards financial independence."}
          </p>
        </footer>
      </main>
    </div>
  );
}

