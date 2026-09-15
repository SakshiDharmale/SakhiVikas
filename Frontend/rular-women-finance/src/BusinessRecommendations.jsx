import {
  ArrowLeft,
  Scissors,
  Milk,
  Utensils,
  Home,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { T } from "./data";

import "./BusinessRecommendations.css";

export default function BusinessRecommendations({
  language,
}) {

  const t = T[language];

  const navigate = useNavigate();

  const businesses = [
    {
      title: t.tailoring,
      description:
        "Low investment business that can be started from home.",
      icon: Scissors,
    },

    {
      title: t.dairy,
      description:
        "Suitable for women interested in milk and dairy products.",
      icon: Milk,
    },

    {
      title: t.foodBusiness,
      description:
        "Can include homemade snacks, food products and tiffin services.",
      icon: Utensils,
    },

    {
      title: t.homeFood,
      description:
        "A home-based option for preparing and selling food products.",
      icon: Home,
    },
  ];

  return (
    <div className="recommendation-page">

      <div className="recommendation-container">

        <button
          className="page-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={17} />

          {t.backToDashboard}
        </button>


        <div className="recommendation-heading">

          <h1>
            {t.businessRecoTitle}
          </h1>

          <p>
            {t.businessRecoDesc}
          </p>

        </div>


        <div className="recommendation-grid">

          {businesses.map((business) => {

            const Icon = business.icon;

            return (

              <div
                className="recommendation-card"
                key={business.title}
              >

                <div className="recommendation-icon">

                  <Icon size={25} />

                </div>

                <h2>
                  {business.title}
                </h2>

                <p>
                  {business.description}
                </p>

                <span className="recommendation-label">
                  Recommended
                </span>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}