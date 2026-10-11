import React from "react";
import { T } from "../data";
import "./VillageBusiness.css";

import village1 from "../assets/village1.png";
import village2 from "../assets/village2.png";
import village3 from "../assets/village3.png";
import village4 from "../assets/village4.png";
import village5 from "../assets/village5.png";
import village6 from "../assets/village6.png";

const images = [
  village1,
  village2,
  village3,
  village4,
  village5,
  village6,
];

function VillageBusiness({ language }) {
  const t = T[language] || T.en;
  const sections = t.villageSections || T.en.villageSections;

  return (
    <main className="village-page">
      <div className="village-container">
        <header className="village-header">
          <h1>
            {t.businessVillageTitle || "Village Shops and Services"}
          </h1>

          <p>
            {language === "hi"
              ? "गांव में दुकान या सेवा व्यवसाय को बेहतर बनाने और बढ़ाने के लिए सीखें।"
              : language === "mr"
              ? "गावातील दुकान किंवा सेवा व्यवसाय सुधारण्यासाठी आणि वाढवण्यासाठी शिका."
              : "Learn practical skills to manage and grow a village shop or service business."}
          </p>
        </header>

        <div className="village-list">
          {sections.map((section, index) => (
            <article className="village-card" key={section.title}>
              <div className="village-image-wrap">
                <img
                  src={images[index]}
                  alt={section.title}
                  className="village-image"
                  loading="lazy"
                />
              </div>

              <div className="village-content">
                <h2>
                  {index + 1}. {section.title}
                </h2>

                <p className="village-description">
                  {section.description}
                </p>

                <div className="village-links">
                  {section.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="village-link"
                    >
                      <span aria-hidden="true">▶</span>
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="village-goal">{section.goal}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default VillageBusiness;