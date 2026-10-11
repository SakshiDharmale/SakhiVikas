import React from "react";
import { useNavigate } from "react-router-dom";
import { T } from "./data";
import "./BusinessInfoHub.css";

const businesses = [
  { id: "food", title: "businessFoodTitle" },
  { id: "tailoring", title: "businessTailoringTitle" },
  { id: "agriculture", title: "businessAgricultureTitle" },
  { id: "handicraft", title: "businessHandicraftTitle" },
  { id: "village", title: "businessVillageTitle" },
  { id: "other", title: "businessOtherTitle" },
];

export function BusinessInfoHub({ language }) {
  const navigate = useNavigate();
  const t = T[language] || T.en;

  const handleBusinessClick = (businessId) => {
    navigate(`/business-info/${businessId}`);
  };

  return (
    <main className="business-page">
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
