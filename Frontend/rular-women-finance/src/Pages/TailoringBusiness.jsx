import React from "react";
import { useNavigate } from "react-router-dom";
import { T } from "../data";
import "./TailoringBusiness.css";
import tailor1 from "../assets/tailor1.png";
import tailor2 from "../assets/tailor2.png"
import tailor3 from "../assets/tailor3.png"
import tailor4 from "../assets/tailor4.png"
import tailor5 from "../assets/tailor5.png"
import tailor6 from "../assets/tailor6.png"

const images = [
  tailor1,
  tailor2,
  tailor3,
  tailor4,
  tailor5,
  tailor6,
];

function TailoringBusiness({ language }) {
  const navigate = useNavigate();
  const t = T[language] || T.en;
  const sections = t.tailoringSections || T.en.tailoringSections;

  return (
    <main className="tailoring-page">
      <div className="tailoring-container">

        <header className="tailoring-header">
          <h1>{t.businessTailoringTitle || "Tailoring Business"}</h1>
          <p>
            {language === "hi"
              ? "अपने सिलाई व्यवसाय को बेहतर बनाने और आगे बढ़ाने के लिए सीखें।"
              : language === "mr"
              ? "तुमचा शिवणकाम व्यवसाय सुधारण्यासाठी आणि वाढवण्यासाठी शिका."
              : "Learn practical skills to improve and grow your tailoring business."}
          </p>
        </header>

        <div className="tailoring-list">
          {sections.map((section, index) => (
            <article className="tailoring-card" key={section.title}>
              <div className="tailoring-image-wrap">
                <img
                  src={images[index]}
                  alt={section.title}
                  className="tailoring-image"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
              </div>

              <div className="tailoring-content">
                <h2>
                  {index + 1}. {section.title}
                </h2>

                <p className="tailoring-description">
                  {section.description}
                </p>

                <div className="tailoring-links">
                  {section.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tailoring-link"
                    >
                      <span aria-hidden="true">▶</span>
                      {link.label}
                    </a>
                  ))}
                </div>

                <p className="tailoring-goal">{section.goal}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default TailoringBusiness;
