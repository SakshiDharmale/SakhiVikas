import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import ChooseLanguage from "./ChooseLanguage";
import Login from "./Login";
import Register from "./Register";
import OTP from "./OTP";
import Success from "./Success";

import Dashboard from "./Dashboard";
import ExpenseTracker from "./ExpenseTracker";
import BusinessRecommendations from "./BusinessRecommendations";
import BusinessInfoHub from "./BusinessInfoHub";

function App() {
  const [language, setLanguage] = useState(null);

  const [authData, setAuthData] = useState({
    name: "",
    mobile: "",
    password: "",
    mode: "login",
  });

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LANGUAGE ================= */}
        <Route
          path="/"
          element={
            <ChooseLanguage
              language={language}
              setLanguage={setLanguage}
            />
          }
        />

        {/* ================= LOGIN ================= */}
        <Route
          path="/login"
          element={
            language ? (
              <Login
                language={language}
                setAuthData={setAuthData}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= REGISTER ================= */}
        <Route
          path="/register"
          element={
            language ? (
              <Register
                language={language}
                setAuthData={setAuthData}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= OTP ================= */}
        <Route
          path="/otp"
          element={
            language ? (
              <OTP
                language={language}
                authData={authData}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= SUCCESS ================= */}
        <Route
          path="/success"
          element={
            language ? (
              <Success
                language={language}
                mode={authData.mode}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= DASHBOARD ================= */}
        <Route
          path="/dashboard"
          element={
            language ? (
              <Dashboard language={language} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= EXPENSE TRACKER ================= */}
        <Route
          path="/expense-tracker"
          element={
            language ? (
              <ExpenseTracker language={language} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= BUSINESS RECOMMENDATIONS ================= */}
        <Route
          path="/business-recommendations"
          element={
            language ? (
              <BusinessRecommendations language={language} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= BUSINESS INFO HUB ================= */}
        <Route
          path="/business-info"
          element={
            language ? (
              <BusinessInfoHub language={language} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= UNKNOWN URL ================= */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;