import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T } from "./data";
import AuthShell from "./components/AuthShell";

import {
  TextField,
  FieldLabel,
  PrimaryButton,
} from "./components/Field";

import "./components/AuthShell.css";
import "./components/Field.css";
import "./Register.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Register({
  language,
  setAuthData,
}) {
  const t = T[language];

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] =useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const next = {};

    if (!name.trim()) {
      next.name = t.errName;
    }

    if (!/^\d{10}$/.test(mobile)) {
      next.mobile = t.errMobile;
    }

    if (
      password.length < 6 ||
      password.length > 12
    ) {
      next.password =
        "Password must be between 6 and 12 characters.";
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    try {
      setSubmitting(true);

      // --------------------------------
      // REGISTER USER
      // --------------------------------

      const registerResponse =
        await fetch(
          `${API_BASE_URL}/register`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              name: name.trim(),
              mobile_Number: mobile,
              password: password,
            }),
          }
        );

      const registerResult =
        await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(
          registerResult.error ||
          "Registration failed."
        );
      }

      // --------------------------------
      // LOGIN AFTER SUCCESSFUL REGISTER
      // --------------------------------

      const loginResponse =
        await fetch(
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

      const loginResult =
        await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(
          loginResult.error ||
          "Registration successful, but automatic login failed."
        );
      }

      // Save JWT token
      

      setAuthData({
        name,
        mobile,
        password,
        mode: "register",
      });

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      setErrors({
        api:
          error.message ||
          "Unable to register. Please try again.",
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

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            {t.loginTab}
          </button>

          <button className="active-tab">
            {t.registerTab}
          </button>

        </div>

        {/* TITLE */}
        <h2 className="auth-title">
          {t.registerTitle}
        </h2>

        <p className="auth-subtitle">
          {t.registerSubtitle}
        </p>

        {/* API ERROR */}
        {errors.api && (
          <p className="error-text">
            {errors.api}
          </p>
        )}

        {/* FORM */}
        <form onSubmit={submit}>

          {/* NAME */}
          <TextField
            label={t.nameLabel}
            placeholder={t.namePlaceholder}
            value={name}
            error={errors.name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

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
                setPassword(
                  e.target.value
                )
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
                : t.registerBtn}

              {!submitting && (
                <ArrowRight size={18} />
              )}
            </PrimaryButton>

          </div>

        </form>

        {/* LOGIN LINK */}
        <p className="switch-text">

          {t.haveAccount}{" "}

          <button
            onClick={() =>
              navigate("/login")
            }
          >
            {t.loginLink}
          </button>

        </p>

      </div>
    </AuthShell>
  );
}