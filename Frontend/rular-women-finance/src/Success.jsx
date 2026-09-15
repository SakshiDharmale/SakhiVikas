import {
  ArrowRight,
  Check,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  colors,
  T,
} from "./data";

import "./Success.css";

export default function Success({
  language,
  mode,
}) {

  const t = T[language];

  const navigate = useNavigate();

  const isRegister =
    mode === "register";

  return (

    <div className="success-page">

      <div className="success-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">

          <Check
            size={30}
            color={colors.white}
          />

        </div>


        {/* TITLE */}

        <h2>

          {isRegister
            ? t.successRegisterTitle
            : t.successLoginTitle}

        </h2>


        {/* MESSAGE */}

        <p>

          {isRegister
            ? t.successRegisterBody
            : t.successLoginBody}

        </p>


        {/* REGISTER SUCCESS */}

        {isRegister ? (

          <button
            className="success-button"
            onClick={() =>
              navigate("/login")
            }
          >

            {t.goToLoginBtn}

            <ArrowRight
              size={18}
            />

          </button>

        ) : (

          /* LOGIN SUCCESS */

          <button
            className="success-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >

            {t.goToDashboardBtn}

            <ArrowRight
              size={18}
            />

          </button>

        )}

      </div>

    </div>
  );
}