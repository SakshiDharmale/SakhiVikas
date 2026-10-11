import React from "react";
import { T } from "../data";
import "./HandicraftBusiness.css";

import craft1 from "../assets/craft1.png";
import craft2 from "../assets/craft2.png";
import craft3 from "../assets/craft3.png";
import craft4 from "../assets/craft4.png";
import craft5 from "../assets/craft5.png";
import craft6 from "../assets/craft6.png";

const images = [
  craft1,
  craft2,
  craft3,
  craft4,
  craft5,
  craft6,
];

function HandicraftBusiness({ language }) {
  const t = T[language] || T.en;
  const sections =
    t.handicraftSections || T.en.handicraftSections;

  return (
    <main className="handicraft-page">
      <div className="handicraft-container">
        <header className="handicraft-header">
          <h1>
            {t.businessHandicraftTitle || "Handicraft and Handmade Products"}
          </h1>
          <p>
            {language === "hi"
              ? "हस्तनिर्मित उत्पादों की गुणवत्ता सुधारने और अपने व्यवसाय को बढ़ाने के लिए सीखें।"
              : language === "mr"
              ? "हाताने बनवलेल्या उत्पादनांची गुणवत्ता सुधारण्यासाठी आणि व्यवसाय वाढवण्यासाठी शिका."
              : "Learn practical skills to improve handmade products and grow your handicraft business."}
          </p>
        </header>

        <div className="handicraft-list">
          {sections.map((section, index) => (
            <article
              className="handicraft-card"
              key={section.title}
            >
              <div className="handicraft-image-wrap">
                <img
                  src={images[index]}
                  alt={section.title}
                  className="handicraft-image"
                  loading="lazy"
                />
              </div>

              <div className="handicraft-content">
                <h2>
                  {index + 1}. {section.title}
                </h2>

                <p className="handicraft-description">
                  {section.description}
                </p>

                <div className="handicraft-links">
                  {section.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="handicraft-link"
                    >
                      <span aria-hidden="true">▶</span>
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="handicraft-goal">
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

export default HandicraftBusiness;