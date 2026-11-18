
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { T } from "./data";
import "./BusinessInfoHub.css";

const businesses = [
  { id: "food", title: "businessFoodTitle" },
  { id: "tailoring", title: "businessTailoringTitle" },
  { id: "agriculture", title: "businessAgricultureTitle" },
  { id: "handicraft", title: "businessHandicraftTitle" },
  { id: "village", title: "businessVillageTitle" },
];

export function BusinessInfoHub({ language }) {
  const navigate = useNavigate();
  const t = T[language] || T.en;

  const handleBusinessClick = (businessId) => {
    navigate(`/business-info/${businessId}`);
  };

  return (
    <main className="business-page">

      {/* Back Button - Outside Business Container */}
      <button
        type="button"
        className="business-dashboard-back"
        onClick={() => navigate("/dashboard")}
      >
        <ArrowLeft size={18} />
        <span>{t.backToDashboard || "Back to Dashboard"}</span>
      </button>

      <div className="business-container">
        <h1>{t.businessInfoHeading}</h1>

        <p className="business-subtitle">
          {t.businessInfoSubtitle}
        </p>

        <div className="business-grid">
          {businesses.map((business, index) => (
            <button
              key={business.id}
              type="button"
              className="business-option"
              onClick={() => handleBusinessClick(business.id)}
            >
              <span className="business-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="business-option-title">
                {t[business.title]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
