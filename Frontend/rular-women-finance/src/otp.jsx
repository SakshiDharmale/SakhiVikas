import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  Check,
  Sprout,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { colors, T } from "./data";

import {
  PrimaryButton,
} from "./components/Field";

import "./components/AuthShell.css";
import "./components/Field.css";

import "./OTP.css";


function OtpInput({
  value,
  onChange,
  error,
}) {

  const refs = useRef([]);

  const setDigit = (
    index,
    digit
  ) => {

    const next = [
      ...value,
    ];

    next[index] = digit;

    onChange(next);

    if (
      digit &&
      index < 5
    ) {

      refs.current[
        index + 1
      ]?.focus();

    }
  };


  const handleKeyDown = (
    index,
    event
  ) => {

    if (
      event.key ===
        "Backspace" &&
      !value[index] &&
      index > 0
    ) {

      refs.current[
        index - 1
      ]?.focus();

    }
  };


  const handlePaste = (
    event
  ) => {

    const text =
      event.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!text) {
      return;
    }

    event.preventDefault();

    const next =
      Array(6).fill("");

    text
      .split("")
      .forEach(
        (digit, index) => {
          next[index] = digit;
        }
      );

    onChange(next);
  };


  return (

    <div>

      <div
        className="otp-inputs"
        onPaste={handlePaste}
      >

        {value.map(
          (digit, index) => (

            <input
              key={index}

              ref={(element) =>
                (refs.current[
                  index
                ] = element)
              }

              value={digit}

              inputMode="numeric"

              maxLength={1}

              onChange={(e) =>
                setDigit(
                  index,
                  e.target.value
                    .replace(
                      /\D/g,
                      ""
                    )
                    .slice(-1)
                )
              }

              onKeyDown={(e) =>
                handleKeyDown(
                  index,
                  e
                )
              }

              className={`otp-box ${
                error
                  ? "input-error"
                  : ""
              }`}
            />

          )
        )}

      </div>

      {error && (

        <p className="error-text">
          {error}
        </p>

      )}

    </div>
  );
}


export default function OTP({
  language,
  authData,
}) {

  const t = T[language];

  const navigate =
    useNavigate();

  const [otp, setOtp] =
    useState(
      Array(6).fill("")
    );

  const [otpError, setOtpError] =
    useState("");

  const [resendIn, setResendIn] =
    useState(30);

  const [submitting, setSubmitting] =
    useState(false);


  useEffect(() => {

    if (resendIn <= 0) {
      return;
    }

    const timer =
      setInterval(() => {

        setResendIn(
          (value) =>
            Math.max(
              0,
              value - 1
            )
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [resendIn]);


  const verify = () => {

    if (
      otp.join("").length !==
      6
    ) {

      setOtpError(
        t.errOtp
      );

      return;
    }

    setOtpError("");

    setSubmitting(true);

    setTimeout(() => {

      setSubmitting(false);

      navigate("/success");

    }, 500);
  };


  const resend = () => {

    setResendIn(30);

    setOtp(
      Array(6).fill("")
    );

    setOtpError("");
  };


  return (

    <div className="auth-page">

      {/* LEFT */}

      <aside className="side-panel">

        <button
          className="change-language"
          onClick={() =>
            navigate("/login")
          }
        >

          <ArrowLeft size={16} />

          {t.backBtn}

        </button>


        <div className="brand-area">

          <Sprout
            size={50}
            color={colors.marigold}
          />

          <h1>
            {t.appName}
          </h1>

          <p className="tagline">
            {t.tagline}
          </p>

        </div>

      </aside>


      {/* RIGHT */}

      <main className="form-panel">

        <div className="form-container otp-container">

          {/* BACK */}

          <button
            className="back-button"
            onClick={() =>
              navigate(-1)
            }
          >

            <ArrowLeft size={16} />

            {t.backBtn}

          </button>


          {/* ICON */}

          <div className="otp-icon">

            <Sprout
              size={26}
              color={
                colors.marigoldDeep
              }
            />

          </div>


          {/* TITLE */}

          <h2 className="auth-title">
            {t.otpTitle}
          </h2>


          <p className="auth-subtitle">

            {t.otpSubtitle}{" "}

            <strong>
              +91{" "}
              {authData.mobile}
            </strong>

          </p>


          {/* CHANGE NUMBER */}

          <button
            className="change-number"
            onClick={() =>
              navigate(-1)
            }
          >
            {t.changeNumber}
          </button>


          {/* OTP */}

          <div className="otp-section">

            <OtpInput
              value={otp}
              onChange={setOtp}
              error={otpError}
            />

          </div>


          {/* VERIFY */}

          <PrimaryButton
            onClick={verify}
            disabled={submitting}
          >

            {submitting
              ? "…"
              : t.verifyBtn}

            {!submitting && (
              <Check size={18} />
            )}

          </PrimaryButton>


          {/* RESEND */}

          <div className="resend">

            {t.resendPrompt}{" "}

            {resendIn > 0 ? (

              <span>

                {t.resendTimer}{" "}

                {resendIn}

                {t.sec}

              </span>

            ) : (

              <button
                onClick={resend}
              >
                {t.resendBtn}
              </button>

            )}

          </div>

        </div>

      </main>

    </div>
  );
}