import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { T } from "../data";

import SakhiMark from "./SakhiMark";

export default function AuthShell({
  language,
  children,
}) {
  const navigate = useNavigate();

  const t = T[language];

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <aside className="side-panel">

        <button
          className="change-language"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={16} />

          {t.changeLanguageBtn}
        </button>

        <div className="brand-area">

          <SakhiMark size={220} />

          <h1>
            {t.appName}
          </h1>

          {t.brandScript && (
            <p className="brand-script">
              {t.brandScript}
            </p>
          )}

          <p className="tagline">
            {t.tagline}
          </p>

        </div>

        <p className="demo-note">
          {t.demoNote}
        </p>

      </aside>

      {/* RIGHT SIDE */}

      <main className="form-panel">

        {children}

      </main>

    </div>
  );
}