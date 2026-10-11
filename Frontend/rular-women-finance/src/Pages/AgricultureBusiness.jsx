
import React from "react";
import { T } from "../data";
import "./AgricultureBusiness.css";

import agriculture1 from "../assets/agriculture1.png";
import agriculture2 from "../assets/agriculture2.png";
import agriculture3 from "../assets/agriculture3.png";
import agriculture4 from "../assets/agriculture4.png";
import agriculture5 from "../assets/agriculture5.png";
import agriculture6 from "../assets/agriculture6.png";

const images = [
  agriculture1,
  agriculture2,
  agriculture3,
  agriculture4,
  agriculture5,
  agriculture6,
];

function AgricultureBusiness({ language }) {
  const t = T[language] || T.en;

  const sections =
    t.agricultureDairySections ||
    T.en.agricultureDairySections;

  const pageDescription = {
    en: "Learn practical ways to manage dairy animals, improve farming, and grow your agricultural income.",
    hi: "डेयरी पशुओं की देखभाल, खेती में सुधार और कृषि से होने वाली आय बढ़ाने के उपयोगी तरीके सीखें।",
    mr: "दुग्धव्यवसायातील जनावरांची काळजी, शेतीत सुधारणा आणि शेतीतून मिळणारे उत्पन्न वाढवण्याचे उपयुक्त मार्ग शिका.",
  };

  return (
    <main className="agriculture-page">
      <div className="agriculture-container">
        <header className="agriculture-header">
          <h1>
            {t.businessAgricultureTitle ||
              "Agriculture and Dairy Business"}
          </h1>

          <p>
            {pageDescription[language] || pageDescription.en}
          </p>
        </header>

        <div className="agriculture-list">
          {sections.map((section, index) => (
            <article
              className="agriculture-card"
              key={section.title}
            >
              <div className="agriculture-image-wrap">
                <img
                  src={images[index]}
                  alt={section.title}
                  className="agriculture-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              </div>

              <div className="agriculture-content">
                <h2>
                  {index + 1}. {section.title}
                </h2>

                <p className="agriculture-description">
                  {section.description}
                </p>

                <div className="agriculture-links">
                  {section.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="agriculture-link"
                    >
                      <span aria-hidden="true">▶</span>
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="agriculture-goal">
                  {section.goal}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default AgricultureBusiness;
