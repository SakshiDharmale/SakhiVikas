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

import "./Login.css";

export default function Login({
  language,
  setAuthData,
}) {

  const t = T[language];

  const navigate = useNavigate();

  const [mobile, setMobile] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [submitting, setSubmitting] =
    useState(false);

  const submit = (e) => {

    e.preventDefault();

    const next = {};

    if (!/^\d{10}$/.test(mobile)) {
      next.mobile = t.errMobile;
    }

    if (password.length < 6) {
      next.password = t.errPassword;
    }

    setErrors(next);

    if (Object.keys(next).length > 0) {
      return;
    }

    setAuthData({
      name: "",
      mobile,
      password,
      mode: "login",
    });

    setSubmitting(true);

    setTimeout(() => {

      setSubmitting(false);

      navigate("/otp");

    }, 500);
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

        {/* FORM */}

        <form onSubmit={submit}>

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