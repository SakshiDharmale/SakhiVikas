import {
  ArrowRight,
  Wallet,
  Lightbulb,
  Store,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { T } from "./data";

import "./Dashboard.css";

export default function Dashboard({ language }) {

  const t = T[language];

  const navigate = useNavigate();

  const cards = [
    {
      key: "expense",
      icon: Wallet,
      title: t.expenseTrackerTitle,
      desc: t.expenseTrackerDesc,
      path: "/expense-tracker",
    },

    {
      key: "business",
      icon: Lightbulb,
      title: t.businessRecoTitle,
      desc: t.businessRecoDesc,
      path: "/business-recommendations",
    },

    {
      key: "info",
      icon: Store,
      title: t.businessInfoTitle,
      desc: t.businessInfoDesc,
      path: "/business-info",
    },
  ];

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <header className="dashboard-header">

        <div>

          <p className="dashboard-brand">
            SakhiVikas
          </p>

          <h1>
            {t.dashboardTitle}
          </h1>

          <p className="dashboard-subtitle">
            {t.dashboardSubtitle}
          </p>

        </div>

      </header>


      {/* DASHBOARD CARDS */}

      <main className="dashboard-content">

        <div className="dashboard-grid">

          {cards.map((card) => {

            const Icon = card.icon;

            return (

              <button
                key={card.key}
                className="dashboard-card"
                onClick={() =>
                  navigate(card.path)
                }
              >

                <div className="dashboard-card-icon">

                  <Icon size={25} />

                </div>

                <div className="dashboard-card-content">

                  <h2>
                    {card.title}
                  </h2>

                  <p>
                    {card.desc}
                  </p>

                </div>

                <ArrowRight
                  className="dashboard-arrow"
                  size={21}
                />

              </button>

            );

          })}

        </div>

      </main>

    </div>
  );
}