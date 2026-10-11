import { useState } from "react";
import {Eye, EyeOff, ArrowRight} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T } from "./data";
import AuthShell from "./components/AuthShell";
import {TextField,FieldLabel, PrimaryButton,} from "./components/Field";
import "./components/AuthShell.css";
import "./components/Field.css";
import "./Login.css";

const API_BASE_URL =
import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Login({
  language,
  setAuthData,
}) {
  const t = T[language];

  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const next = {};

    if (!/^\d{10}$/.test(mobile)) {
      next.mobile = t.errMobile;
    }

    if (
      password.length < 6 ||
      password.length > 16
    ) {
      next.password =
        "Password must be between 6 and 16 characters.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_BASE_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            
          },

          body: JSON.stringify({
            mobile_Number: mobile,
            password: password,
          }),

        }
      );
      
      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Invalid mobile number or password."
        );
      }

      // Save JWT token
      localStorage.setItem(
        "token",
        result.token
      );

      // Save user id if backend sends it
      
      setAuthData({
        name: "",
        mobile,
        password,
        mode: "login",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setErrors({
        api:
          error.message ||
          "Unable to login. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell language={language}>
      <div className="form-container">

        {/* TABS */}
        <div className="auth-tabs">

          <button className="active-tab">
            {t.loginTab}
          </button>

          <button
            onClick={() =>
              navigate("/register")
            }
          >
            {t.registerTab}
          </button>

        </div>

        {/* TITLE */}
        <h2 className="auth-title">
          {t.loginTitle}
        </h2>

        <p className="auth-subtitle">
          {t.loginSubtitle}
        </p>

        {/* API ERROR */}
        {errors.api && (
          <p className="error-text">
            {errors.api}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={submit}>

          {/* MOBILE */}
          <TextField
            label={t.mobileLabel}
            placeholder={t.mobilePlaceholder}
            inputMode="numeric"
            value={mobile}
            error={errors.mobile}
            onChange={(e) =>
              setMobile(
                e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10)
              )
            }
          />

          {/* PASSWORD */}
          <div className="password-field">

            <FieldLabel>
              {t.passwordLabel}
            </FieldLabel>

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              placeholder={
                t.passwordPlaceholder
              }
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className={`text-input ${
                errors.password
                  ? "input-error"
                  : ""
              }`}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword(
                  (value) => !value
                )
              }
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}

              {showPassword
                ? t.hide
                : t.show}
            </button>

            {errors.password && (
              <p className="error-text">
                {errors.password}
              </p>
            )}

          </div>

          {/* BUTTON */}
          <div className="submit-space">

            <PrimaryButton
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "…"
                : t.loginBtn}

              {!submitting && (
                <ArrowRight size={18} />
              )}
            </PrimaryButton>

          </div>

        </form>

        {/* REGISTER LINK */}
        <p className="switch-text">

          {t.noAccount}{" "}

          <button
            onClick={() =>
              navigate("/register")
            }
          >
            {t.registerLink}
          </button>

        </p>

      </div>
    </AuthShell>
  );
}