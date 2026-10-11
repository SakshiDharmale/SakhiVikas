import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T } from "../data";

export default function AuthShell({ language, children }) {
  const navigate = useNavigate();
  const t = T[language];

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* IMAGE SIDE */}
        <aside className="side-panel">
          <button className="change-language" onClick={() => navigate("/")}>
            
            <ArrowLeft size={16} />
            {t.changeLanguageBtn}
          </button>
        </aside>

        {/* FORM SIDE */}
        <main className="form-panel">{children}</main>

      </div>
    </div>
  );
}