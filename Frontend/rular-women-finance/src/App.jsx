import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import ChooseLanguage from "./ChooseLanguage";
import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import ExpenseTracker from "./ExpenseTracker";
import BusinessRecommendations from "./BusinessRecommendations";
import {BusinessInfoHub} from "./BusinessInfoHub";
import Navbar from "./Components/Navbar";
import FinancialAdvisor from "./FinancialAdvisor";
import TailoringBusiness from "./Pages/TailoringBusiness";
import FoodBusiness from "./Pages/FoodBusiness";
import HandicraftBusiness from "./Pages/HandicraftBusiness";
import AgricultureBusiness from "./Pages/AgricultureBusiness";
import VillageBusiness from "./Pages/VillageBusiness";

function App() {
  {/*const [language, setLanguage] = useState(null);*/}
  
  const [language, setLanguage] = useState(
  localStorage.getItem("language")
);

  const [authData, setAuthData] = useState({
    name: "",
    mobile: "",
    password: "",
    mode: "login",
  });

  return (
    <BrowserRouter>
     {/*<Navbar/>*/}
      <Routes>
        {/* ================= LANGUAGE ================= */}
        <Route
          path="/"
          element={<ChooseLanguage language={language} setLanguage={setLanguage}/>}
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

        <Route
       path="/business-info/tailoring"
       element={<TailoringBusiness language={language} />}
      />
      <Route
      path="/business-info/food"
      element={<FoodBusiness language={language} />}
      />
      <Route
      path="/business-info/agriculture"
      element={<AgricultureBusiness language={language} />}
      />
      <Route
      path="/business-info/handicraft"
      element={<HandicraftBusiness language={language} />}
      />
      <Route
      path="/business-info/village"
      element={<VillageBusiness language={language} />}
      />

    {/* ================= FINANCIAL ADVISOR ================= */}

<Route
  path="/financial-advisor"
  element={
    language ? (
      <FinancialAdvisor language={language} />
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