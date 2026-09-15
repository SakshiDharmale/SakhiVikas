import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  LANGUAGES,
} from "./data";

import SakhiMark from "./components/SakhiMark";

import "./ChooseLanguage.css";

export default function ChooseLanguage({
  language,
  setLanguage,
}) {
  const navigate = useNavigate();

  useEffect(() => {

    if (language) {
      navigate("/login", {
        replace: true,
      });
    }

  }, [language, navigate]);

  const chooseLanguage = (code) => {

    setLanguage(code);

    navigate("/login");
  };

  return (

    <div className="language-page">

      <div className="language-container">

        {/* LOGO */}

        <div className="language-logo">

          <SakhiMark size={140} />

        </div>

        {/* APP NAME */}

        <h1>
          SakhiVikas
        </h1>

        <p className="language-script">
          सखी विकास
        </p>

        {/* LANGUAGE BOX */}

        <div className="language-card">

          <h2>
            Choose your language
            {" · "}
            अपनी भाषा चुनें
            {" · "}
            तुमची भाषा निवडा
          </h2>

          <p>
            Select the language you're
            most comfortable reading
          </p>

          <div className="language-list">

            {LANGUAGES.map((item) => (

              <button
                key={item.code}
                className="language-button"
                onClick={() =>
                  chooseLanguage(item.code)
                }
              >

                <span>
                  {item.native}
                </span>

                <small>
                  {item.label}
                </small>

              </button>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}