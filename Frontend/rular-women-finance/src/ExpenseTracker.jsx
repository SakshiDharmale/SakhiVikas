import { useState } from "react";

import {
  ArrowLeft,
  Calculator,
  Wallet,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { T } from "./data";

import "./ExpenseTracker.css";

export default function ExpenseTracker({ language }) {

  const t = T[language];

  const navigate = useNavigate();

  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");

  const [result, setResult] = useState(null);

  const [errors, setErrors] = useState({});

  const calculateSavings = () => {

    const nextErrors = {};

    const incomeValue = Number(income);
    const expenseValue = Number(expenses);

    if (!income || incomeValue <= 0) {
      nextErrors.income =
        t.incomeRequired;
    }

    if (!expenses || expenseValue < 0) {
      nextErrors.expenses =
        t.expenseRequired;
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const savings =
      incomeValue - expenseValue;

    let status;

    if (savings >= incomeValue * 0.25) {
      status = t.goodSavings;
    } else if (savings >= incomeValue * 0.10) {
      status = t.moderateSavings;
    } else {
      status = t.lowSavings;
    }

    setResult({
      income: incomeValue,
      expenses: expenseValue,
      savings,
      status,
    });
  };

  return (
    <div className="expense-page">

      <div className="expense-container">

        {/* BACK */}

        <button
          className="page-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <ArrowLeft size={17} />

          {t.backToDashboard}
        </button>


        {/* HEADER */}

        <div className="expense-heading">

          <div className="expense-heading-icon">
            <Wallet size={25} />
          </div>

          <h1>
            {t.expenseTrackerTitle}
          </h1>

          <p>
            {t.expenseTrackerDesc}
          </p>

        </div>


        {/* FORM CARD */}

        <div className="expense-card">

          {/* INCOME */}

          <div className="expense-field">

            <label>
              {t.monthlyIncome}
            </label>

            <div className="currency-input">

              <span>₹</span>

              <input
                type="number"
                min="0"
                placeholder={t.enterIncome}
                value={income}
                onChange={(e) =>
                  setIncome(e.target.value)
                }
              />

            </div>

            {errors.income && (
              <p className="expense-error">
                {errors.income}
              </p>
            )}

          </div>


          {/* EXPENSES */}

          <div className="expense-field">

            <label>
              {t.monthlyExpenses}
            </label>

            <div className="currency-input">

              <span>₹</span>

              <input
                type="number"
                min="0"
                placeholder={t.enterExpenses}
                value={expenses}
                onChange={(e) =>
                  setExpenses(e.target.value)
                }
              />

            </div>

            {errors.expenses && (
              <p className="expense-error">
                {errors.expenses}
              </p>
            )}

          </div>


          {/* CALCULATE */}

          <button
            className="calculate-button"
            onClick={calculateSavings}
          >

            <Calculator size={18} />

            {t.calculateSavings}

          </button>

        </div>


        {/* RESULT */}

        {result && (

          <div className="savings-card">

            <div className="result-row">

              <span>
                {t.monthlyIncome}
              </span>

              <strong>
                ₹{result.income.toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="result-row">

              <span>
                {t.totalExpenses}
              </span>

              <strong>
                ₹{result.expenses.toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="result-divider" />


            <div className="result-saving">

              <span>
                {t.monthlySavings}
              </span>

              <strong>
                ₹{result.savings.toLocaleString("en-IN")}
              </strong>

            </div>


            <div className="status-box">

              <span>
                {t.savingsStatus}
              </span>

              <strong>
                {result.status}
              </strong>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}