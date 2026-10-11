import React, { useState } from "react";
import { Plus } from "lucide-react";
import { T } from "./data";
import "./ExpenseTracker.css";

const ExpenseTracker = ({ language = "en" }) => {
  const t = T[language] || T.en;

  // Which button is selected
  const [activeTab, setActiveTab] = useState("income");

  // Income form
  const [incomeAmount, setIncomeAmount] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [incomeNote, setIncomeNote] = useState("");

  // Expense form
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");

  // Saved entries
  const [entries, setEntries] = useState([]);

  // Save button
  const handleSave = () => {
    // ---------------- INCOME ----------------
    if (activeTab === "income") {
      if (!incomeAmount) {
        alert(t.incomeRequired);
        return;
      }

      if (!businessType) {
        alert(t.businessRequired);
        return;
      }

      const newIncome = {
        id: Date.now(),
        type: "income",
        amount: Number(incomeAmount),
        category: businessType,
        note: incomeNote,
        date: new Date().toISOString(),
      };

      setEntries((prev) => [...prev, newIncome]);

      console.log("Income saved:", newIncome);

      alert(t.detailsSaved);

      // Clear form
      setIncomeAmount("");
      setBusinessType("");
      setIncomeNote("");
    }

    // ---------------- EXPENSE ----------------
    if (activeTab === "expense") {
      if (!expenseAmount) {
        alert(t.expenseRequired);
        return;
      }

      if (!expenseType) {
        alert(t.expenseTypeRequired);
        return;
      }

      const newExpense = {
        id: Date.now(),
        type: "expense",
        amount: Number(expenseAmount),
        category: expenseType,
        date: new Date().toISOString(),
      };

      setEntries((prev) => [...prev, newExpense]);

      console.log("Expense saved:", newExpense);

      alert(t.detailsSaved);

      // Clear form
      setExpenseAmount("");
      setExpenseType("");
    }
  };

  return (
    <div className="expense-page">

      <div className="expense-card">

        {/* ================= HEADING ================= */}

        <div className="expense-heading">
          <Plus
            size={38}
            strokeWidth={2.5}
          />

          <h2>{t.newEntry}</h2>
        </div>


        {/* ================= INCOME / EXPENSE BUTTONS ================= */}

        <div className="expense-tabs">

          {/* INCOME */}
          <button
            type="button"
            className={`expense-tab ${
              activeTab === "income"
                ? "active-income"
                : ""
            }`}
            onClick={() => setActiveTab("income")}
          >
            {t.income}
          </button>


          {/* EXPENSE */}
          <button
            type="button"
            className={`expense-tab ${
              activeTab === "expense"
                ? "active-expense"
                : ""
            }`}
            onClick={() => setActiveTab("expense")}
          >
            {t.expense}
          </button>

        </div>


        {/* ===================================================== */}
        {/*                         INCOME                         */}
        {/* ===================================================== */}

        {activeTab === "income" && (
          <div className="expense-form">

            {/* Income Amount */}

            <div className="form-group">

              <label htmlFor="incomeAmount">
                {t.incomeAmount}
              </label>

              <input
                id="incomeAmount"
                type="number"
                min="0"
                value={incomeAmount}
                onChange={(e) =>
                  setIncomeAmount(e.target.value)
                }
              />

            </div>


            {/* Business Type */}

            <div className="form-group">

              <label htmlFor="businessType">
                {t.businessType}
              </label>

              <select
                id="businessType"
                value={businessType}
                onChange={(e) =>
                  setBusinessType(e.target.value)
                }
              >

                <option value="">
                  {t.selectBusiness}
                </option>

                <option value="dairy">
                  {t.businessOptions.dairy}
                </option>

                <option value="farming">
                  {t.businessOptions.farming}
                </option>

                <option value="livestock">
                  {t.businessOptions.livestock}
                </option>

                <option value="poultry">
                  {t.businessOptions.poultry}
                </option>

                <option value="tailoring">
                  {t.businessOptions.tailoring}
                </option>

                <option value="handicraft">
                  {t.businessOptions.handicraft}
                </option>

                <option value="shop">
                  {t.businessOptions.shop}
                </option>

                <option value="food">
                  {t.businessOptions.food}
                </option>

                <option value="other">
                  {t.businessOptions.other}
                </option>

              </select>

            </div>


            {/* Note */}

            <div className="form-group">

              <label htmlFor="incomeNote">
                {t.note}
              </label>

              <input
                id="incomeNote"
                type="text"
                value={incomeNote}
                onChange={(e) =>
                  setIncomeNote(e.target.value)
                }
              />

            </div>


            {/* Save */}

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              {t.save}
            </button>

          </div>
        )}


        {/* ===================================================== */}
        {/*                        EXPENSE                         */}
        {/* ===================================================== */}

        {activeTab === "expense" && (
          <div className="expense-form">

            {/* Expense Amount */}

            <div className="form-group">

              <label htmlFor="expenseAmount">
                {t.expenseAmount}
              </label>

              <input
                id="expenseAmount"
                type="number"
                min="0"
                value={expenseAmount}
                onChange={(e) =>
                  setExpenseAmount(e.target.value)
                }
              />

            </div>


            {/* Expense Type */}

            <div className="form-group">

              <label htmlFor="expenseType">
                {t.expenseType}
              </label>

              <select
                id="expenseType"
                value={expenseType}
                onChange={(e) =>
                  setExpenseType(e.target.value)
                }
              >

                <option value="">
                  {t.selectExpense}
                </option>

                <option value="food">
                  {t.expenseOptions.food}
                </option>

                <option value="farming">
                  {t.expenseOptions.farming}
                </option>

                <option value="livestock">
                  {t.expenseOptions.livestock}
                </option>

                <option value="education">
                  {t.expenseOptions.education}
                </option>

                <option value="health">
                  {t.expenseOptions.health}
                </option>

                <option value="household">
                  {t.expenseOptions.household}
                </option>

                <option value="transport">
                  {t.expenseOptions.transport}
                </option>

                <option value="business">
                  {t.expenseOptions.business}
                </option>

                <option value="loan">
                  {t.expenseOptions.loan}
                </option>

                <option value="other">
                  {t.expenseOptions.other}
                </option>

              </select>

            </div>


            {/* Save */}

            <button
              type="button"
              className="save-button"
              onClick={handleSave}
            >
              {t.save}
            </button>

          </div>
        )}

      </div>


      {/* ===================================================== */}
      {/*                 SAVED ENTRIES                         */}
      {/* ===================================================== */}

      {entries.length > 0 && (
        <div className="saved-entries">

          {entries.map((entry) => (
            <div
              className="saved-entry"
              key={entry.id}
            >

              <div>
                <strong>
                  {entry.type === "income"
                    ? t.income
                    : t.expense}
                </strong>

                <span>
                  ₹{entry.amount}
                </span>
              </div>

              {entry.note && (
                <p>{entry.note}</p>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ExpenseTracker;