
import React from "react";
import { T } from "../data";
import "./FoodBusiness.css";

import food1 from "../assets/food1.png";
import food2 from "../assets/food2.png";
import food3 from "../assets/food3.png";
import food4 from "../assets/food4.png";
import food5 from "../assets/food5.png";
import food6 from "../assets/food6.png";

const images = [
  food1,
  food2,
  food3,
  food4,
  food5,
  food6,
];

function FoodBusiness({ language }) {
  const t = T[language] || T.en;

  const sections =
    t.foodProductionSections ||
    T.en.foodProductionSections;

  const pageDescription = {
    en: "Learn practical skills to start, manage, and grow a small food production business.",
    hi: "छोटा खाद्य उत्पादन व्यवसाय शुरू करने, चलाने और बढ़ाने के लिए उपयोगी कौशल सीखें।",
    mr: "लहान खाद्य उत्पादन व्यवसाय सुरू करण्यासाठी, चालवण्यासाठी आणि वाढवण्यासाठी उपयुक्त कौशल्ये शिका.",
  };

  return (
    <main className="food-page">
      <div className="food-container">
        <header className="food-header">
          <h1>
            {t.businessFoodTitle || "Food Production Business"}
          </h1>

          <p>
            {pageDescription[language] || pageDescription.en}
          </p>
        </header>

        <div className="food-list">
          {sections.map((section, index) => (
            <article className="food-card" key={section.title}>
              <div className="food-image-wrap">
                <img
                  src={images[index]}
                  alt={section.title}
                  className="food-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              </div>

              <div className="food-content">
                <h2>
                  {index + 1}. {section.title}
                </h2>

                <p className="food-description">
                  {section.description}
                </p>

                <div className="food-links">
                  {section.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="food-link"
                    >
                      <span aria-hidden="true">▶</span>
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="food-goal">{section.goal}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default FoodBusiness;
