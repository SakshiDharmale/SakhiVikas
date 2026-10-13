import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, LoaderCircle, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { T } from "./data";
import "./ExpenseTracker.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const LOCALES = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };
const INCOME_CATEGORIES = ["dairy", "farming", "livestock", "poultry", "tailoring", "handicraft", "shop", "food", "other"];
const EXPENSE_CATEGORIES = ["food", "farming", "livestock", "education", "health", "household", "transport", "business", "loan", "other"];

async function apiRequest(path, token, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    if (response.status === 401 || response.status === 403) localStorage.removeItem("token");
    throw new Error(result.message || result.error || "Request failed. Please try again.");
  }
  return result;
}

const ExpenseTracker = ({ language = "en" }) => {
  const t = T[language] || T.en;
  const [activeTab, setActiveTab] = useState("income");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [incomeNote, setIncomeNote] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseType, setExpenseType] = useState("");
  const [incomeRows, setIncomeRows] = useState([]);
  const [expenseRows, setExpenseRows] = useState([]);
  const [draftAmounts, setDraftAmounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = useMemo(() => localStorage.getItem("token"), []);

  const loadEntries = useCallback(async () => {
    if (!token) {
      setError(t.faMissingToken || "Please log in again. Your authentication token is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const [incomeResult, expenseResult] = await Promise.all([
        apiRequest("/GetAllIncome", token),
        apiRequest("/GetAllExpense", token),
      ]);
      setIncomeRows(Array.isArray(incomeResult.income) ? incomeResult.income : []);
      setExpenseRows(Array.isArray(expenseResult.expenses) ? expenseResult.expenses : []);
    } catch (err) {
      setError(err.message || "Unable to load your entries.");
    } finally {
      setLoading(false);
    }
  }, [token, t.faMissingToken]);

  useEffect(() => { loadEntries(); }, [loadEntries]);

  const submitEntry = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    const isIncome = activeTab === "income";
    const rawAmount = isIncome ? incomeAmount : expenseAmount;
    const category = isIncome ? businessType : expenseType;
    if (!Number.isFinite(Number(rawAmount)) || Number(rawAmount) <= 0) {
      setError(isIncome ? (t.incomeRequired || "Enter an income amount greater than zero.") : (t.expenseRequired || "Enter an expense amount greater than zero."));
      return;
    }
    if (!category) {
      setError(isIncome ? (t.businessRequired || "Choose an income category.") : (t.expenseTypeRequired || "Choose an expense category."));
      return;
    }

    setSaving(true);
    try {
      const today = new Date();
      const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const path = isIncome ? "/AddIncome" : "/AddExpense";
      const body = isIncome
        ? { amount: Number(rawAmount), category, description: incomeNote.trim() || category, date }
        : { amount: Number(rawAmount), category, date };
      await apiRequest(path, token, { method: "POST", body: JSON.stringify(body) });
      if (isIncome) {
        setIncomeAmount(""); setBusinessType(""); setIncomeNote("");
      } else {
        setExpenseAmount(""); setExpenseType("");
      }
      setNotice(t.detailsSaved || "Entry saved successfully.");
      await loadEntries();
    } catch (err) {
      setError(err.message || "Unable to save this entry.");
    } finally {
      setSaving(false);
    }
  };

  const saveAmount = async (kind, row) => {
    const amount = Number(draftAmounts[`${kind}-${row.id}`] ?? row.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter an amount greater than zero.");
      return;
    }
    setError(""); setNotice(""); setSaving(true);
    try {
      const route = kind === "income" ? "UpdateIncome" : "UpdateExpense";
      await apiRequest(`/${route}/${row.id}`, token, { method: "PUT", body: JSON.stringify({ amount }) });
      setDraftAmounts((drafts) => { const next = { ...drafts }; delete next[`${kind}-${row.id}`]; return next; });
      setNotice("Amount updated successfully.");
      await loadEntries();
    } catch (err) {
      setError(err.message || "Unable to update this amount.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEntry = async (kind, row) => {
    setError(""); setNotice(""); setSaving(true);
    try {
      const route = kind === "income" ? "DeleteIncome" : "DeleteExpense";
      await apiRequest(`/${route}/${row.id}`, token, { method: "DELETE" });
      setNotice(kind === "income" ? "Income entry deleted." : "Expense entry deleted.");
      await loadEntries();
    } catch (err) {
      setError(err.message || "Unable to delete this entry.");
    } finally {
      setSaving(false);
    }
  };

  const categoryLabel = (kind, key) => {
    const group = kind === "income" ? t.businessOptions : t.expenseOptions;
    return group?.[key] || key || "—";
  };
  const formatDate = (value) => {
    if (!value) return "—";
    const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
    return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString(LOCALES[language] || "en-IN");
  };
  const formatMoney = (value) => new Intl.NumberFormat(LOCALES[language] || "en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(Number(value) || 0);

  const renderRows = (kind, rows) => (
    <div className="tracker-table-wrap">
      <table className="tracker-table">
        <thead><tr>
          <th>{t.dateLabel || "Date"}</th>
          <th>{kind === "income" ? (t.businessType || "Source") : (t.expenseType || "Category")}</th>
          {kind === "income" && <th>{t.note || "Note"}</th>}
          <th>{t.amountLabel || "Amount"}</th>
          <th>{t.actionsLabel || "Actions"}</th>
        </tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td className="tracker-empty" colSpan={kind === "income" ? 5 : 4}>{t.noEntries || "No entries yet. Add your first one above."}</td></tr> : rows.map((row) => {
            const amountKey = `${kind}-${row.id}`;
            const amountValue = draftAmounts[amountKey] ?? String(row.amount ?? "");
            return <tr key={row.id}>
              <td>{formatDate(row.date || row.expense_date)}</td>
              <td>{categoryLabel(kind, row.category)}{kind === "income" && row.description && row.description !== row.category && <small className="tracker-description">{row.description}</small>}</td>
              {kind === "income" && <td>{row.description && row.description !== row.category ? row.description : "—"}</td>}
              <td><label className="tracker-amount-field"><span>₹</span><input aria-label={`${t.amountLabel || "Amount"} ${row.id}`} type="number" min="0.01" step="0.01" value={amountValue} onChange={(event) => setDraftAmounts((drafts) => ({ ...drafts, [amountKey]: event.target.value }))} /></label></td>
              <td><div className="tracker-actions"><button type="button" className="tracker-action save" disabled={saving || Number(amountValue) === Number(row.amount)} onClick={() => saveAmount(kind, row)} aria-label="Save amount"><Save size={16} /><span>{t.save || "Save"}</span></button><button type="button" className="tracker-action delete" disabled={saving} onClick={() => deleteEntry(kind, row)} aria-label={t.deleteLabel || "Delete entry"}><Trash2 size={16} /><span>{t.deleteLabel || "Delete"}</span></button></div></td>
            </tr>;
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="expense-page">
      <div className="expense-layout">
        <section className="expense-card">
          <div className="expense-heading"><span className="expense-heading-icon"><Plus size={22} /></span><div><h1>{t.expenseTrackerTitle || "Income & Expense Tracker"}</h1><p>{t.expenseTrackerDesc || "Record your money and keep every entry up to date."}</p></div></div>
          <div className="expense-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={activeTab === "income"} className={`expense-tab ${activeTab === "income" ? "active-income" : ""}`} onClick={() => { setActiveTab("income"); setError(""); setNotice(""); }}><ArrowDownLeft size={18} />{t.income}</button>
            <button type="button" role="tab" aria-selected={activeTab === "expense"} className={`expense-tab ${activeTab === "expense" ? "active-expense" : ""}`} onClick={() => { setActiveTab("expense"); setError(""); setNotice(""); }}><ArrowUpRight size={18} />{t.expense}</button>
          </div>
          <form className="expense-form" onSubmit={submitEntry}>
            <div className="form-group"><label htmlFor="entryAmount">{activeTab === "income" ? t.incomeAmount : t.expenseAmount}</label><input id="entryAmount" type="number" inputMode="decimal" min="0.01" step="0.01" value={activeTab === "income" ? incomeAmount : expenseAmount} onChange={(event) => activeTab === "income" ? setIncomeAmount(event.target.value) : setExpenseAmount(event.target.value)} placeholder="0.00" required /></div>
            <div className="form-group"><label htmlFor="entryCategory">{activeTab === "income" ? t.businessType : t.expenseType}</label><select id="entryCategory" value={activeTab === "income" ? businessType : expenseType} onChange={(event) => activeTab === "income" ? setBusinessType(event.target.value) : setExpenseType(event.target.value)} required><option value="">{activeTab === "income" ? t.selectBusiness : t.selectExpense}</option>{(activeTab === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((key) => <option key={key} value={key}>{categoryLabel(activeTab, key)}</option>)}</select></div>
            {activeTab === "income" && <div className="form-group"><label htmlFor="incomeNote">{t.note}</label><input id="incomeNote" type="text" value={incomeNote} onChange={(event) => setIncomeNote(event.target.value)} placeholder={t.notePlaceholder || "What was this income for?"} /></div>}
            <button className="save-button" type="submit" disabled={saving}>{saving ? <LoaderCircle className="tracker-spinner" size={18} /> : <Plus size={18} />}{saving ? (t.savingLabel || "Saving…") : (t.save || "Save entry")}</button>
          </form>
          {error && <p className="tracker-message error" role="alert">{error}</p>}
          {notice && <p className="tracker-message success" role="status">{notice}</p>}
        </section>

        <section className="tracker-entries">
          <div className="tracker-section-heading"><div><h2>{t.incomeEntriesTitle || "Income entries"}</h2><p>{incomeRows.length} {t.entriesCount || "entries"}</p></div><button type="button" className="tracker-refresh" onClick={loadEntries} disabled={loading} aria-label={t.refreshLabel || "Refresh entries"}><RefreshCw size={17} className={loading ? "tracker-spinner" : ""} /></button></div>
          {loading ? <p className="tracker-loading"><LoaderCircle className="tracker-spinner" size={20} />{t.loadingEntries || "Loading entries…"}</p> : renderRows("income", incomeRows)}
        </section>

        <section className="tracker-entries">
          <div className="tracker-section-heading"><div><h2>{t.expenseEntriesTitle || "Expense entries"}</h2><p>{expenseRows.length} {t.entriesCount || "entries"}</p></div></div>
          {loading ? <p className="tracker-loading"><LoaderCircle className="tracker-spinner" size={20} />{t.loadingEntries || "Loading entries…"}</p> : renderRows("expense", expenseRows)}
        </section>
      </div>
    </main>
  );
};

export default ExpenseTracker;
