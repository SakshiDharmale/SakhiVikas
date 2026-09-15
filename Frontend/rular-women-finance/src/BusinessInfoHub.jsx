import {
  ArrowLeft,
  Scissors,
  Milk,
  Utensils,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { T } from "./data";

import "./BusinessInfoHub.css";

export default function BusinessInfoHub({
  language,
}) {

  const t = T[language];

  const navigate = useNavigate();

  const information = [
    {
      title: t.tailoring,
      text: t.tailoringInfo,
      icon: Scissors,
    },

    {
      title: t.dairy,
      text: t.dairyInfo,
      icon: Milk,
    },

    {
      title: t.foodBusiness,
      text: t.foodInfo,
      icon: Utensils,
    },
  ];

  return (
    <div className="business-info-page">

      <div className="business-info-container">

        <button
          className="page-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={17} />

          {t.backToDashboard}
        </button>


        <div className="business-info-heading">

          <h1>
            {t.businessInfoTitle}
          </h1>

          <p>
            {t.businessInfoDesc}
          </p>

        </div>


        <div className="business-info-list">

          {information.map((item) => {

            const Icon = item.icon;

            return (

              <div
                className="business-info-card"
                key={item.title}
              >

                <div className="business-info-icon">

                  <Icon size={24} />

                </div>

                <div>

                  <h2>
                    {item.title}
                  </h2>

                  <p>
                    {item.text}
                  </p>

                </div>

              </div>

            );

          })}

        </div>

      </div>

    </div>
  );
}