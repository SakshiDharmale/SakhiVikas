import { useEffect, useState } from "react";
import {
  ArrowRight, BarChart3, CheckCircle2, CircleDollarSign, CreditCard, Info, Lightbulb,
  PiggyBank, PieChart, RefreshCw, TrendingDown, TrendingUp, Wallet, X,
} from "lucide-react";
import { T } from "./data";
import "./FinancialAdvisor.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
const LOCALES = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

/* ---------- helpers ---------- */
const backendLanguage = (l) => (l === "hi" ? "Hindi" : l === "mr" ? "Marathi" : "English");
const num = (v) => Number(v) || 0;
const rupees = (v) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(num(v));
const compact = (v) => {
  const n = num(v), a = Math.abs(n);
  if (a >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`;
  if (a >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`;
  if (a >= 1e3) return `₹${(n / 1e3).toFixed(1)}K`;
  return `₹${Math.round(n)}`;
};

// Turns "2026-09" / "September 2026" into "September 2026". Returns null if it cannot read it.
function monthLabel(period, language) {
  const s = String(period ?? "");
  let d = null;

  const m = s.match(/(\d{4})[-/](\d{1,2})/);

  if (m) {
    d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  } else if (s && !Number.isNaN(Date.parse(s))) {
    d = new Date(s);
  }

  return d && !Number.isNaN(d.getTime())
    ? d.toLocaleDateString(LOCALES[language] || "en-IN", {
        month: "long",
        year: "numeric",
      })
    : null;
}

function normalize(result) {
  const root =
    result?.data?.analytics ??
    result?.analytics ??
    result?.data ??
    result ??
    {};

  const f = root.financial ?? root;
  const sp = root.spendingPattern ?? {};
  const ca = root.categoryAnalysis ?? {};
  const h = root.financialHealth ?? {};

  const income = num(f.totalIncome ?? f.income);
  const expense = num(f.totalExpense ?? f.expense);

  const balance = num(
    f.availableBalance ??
      f.balance ??
      income - expense
  );

  const rawHistory =
    sp.history ??
    sp.monthlyHistory ??
    root.history ??
    root.monthlyHistory ??
    [];

  const history = Array.isArray(rawHistory)
    ? rawHistory
    : [];

  const categoryWise =
    ca.CategoryWise ??
    ca.categoryWise ??
    ca.categoryTotals ??
    root.CategoryWise ??
    {};

  let categoryPercentages =
    ca.CategoryPercentages ??
    ca.categoryPercentages ??
    {};

  // Calculate percentages if the backend does not provide them.
  if (
    Object.keys(categoryPercentages).length === 0 &&
    Object.keys(categoryWise).length > 0
  ) {
    const total = Object.values(categoryWise).reduce(
      (sum, value) => sum + num(value),
      0
    );

    categoryPercentages = Object.fromEntries(
      Object.entries(categoryWise).map(([name, amount]) => [
        name,
        total > 0 ? (num(amount) / total) * 100 : 0,
      ])
    );
  }

  const rawSuggestions =
    root.personalizedSuggestions ??
    root.suggestions ??
    root.advice ??
    "";

  const suggestions = Array.isArray(rawSuggestions)
    ? rawSuggestions
        .map((item) =>
          typeof item === "string"
            ? item
            : item?.suggestion ?? item?.text ?? item?.message ?? ""
        )
        .filter(Boolean)
        .join("\n")
    : typeof rawSuggestions === "string"
      ? rawSuggestions
      : rawSuggestions?.suggestions?.join?.("\n") ??
        rawSuggestions?.text ??
        rawSuggestions?.message ??
        "";

  const comparison = sp.comparison ?? {};

  return {
    income,
    expense,
    balance,

    savingsRate: num(f.savingsRate),

    history,

    incomeChange:
      comparison.income?.percentageChange ?? null,

    expenseChange:
      comparison.expense?.percentageChange ?? null,

    categoryWise:
      categoryWise &&
      typeof categoryWise === "object" &&
      !Array.isArray(categoryWise)
        ? categoryWise
        : {},

    categoryPercentages:
      categoryPercentages &&
      typeof categoryPercentages === "object"
        ? categoryPercentages
        : {},

    health: {
      score: num(h.score),
      saving: num(h.saving ?? h.savingsRate),
      expenseRatio: num(h.expenseRatio),
      stability: num(h.stabilityScore ?? h.stability),
    },

    suggestions,
  };
}

const Head = ({ icon: Icon, tone = "", title, sub, extra }) => (
  <div className="panel-header">
    <div className="panel-title-wrapper">
      <div className={`panel-icon ${tone}`}><Icon size={18} /></div>
      <div><h2>{title}</h2><p>{sub}</p></div>
    </div>
    {extra}
  </div>
);

const Badge = ({ change, upIsGood }) => {
  if (change === null) return null;
  const up = change >= 0;
  return (
    <span className={`percentage-badge ${(upIsGood ? up : !up) ? "positive" : "negative"}`}>
      {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
      {Math.abs(change).toFixed(1)}%
    </span>
  );
};

/* ---------- component ---------- */
export default function FinancialAdvisor({ language }) {
  const t = T[language] || T.en || {};
  const L = (key, fallback) => t[key] || fallback;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("month");
  const [view, setView] = useState("amount"); // "amount" | "rate"
  const [activeCat, setActiveCat] = useState(null);
  const [band, setBand] = useState(null);
  const [done, setDone] = useState({});

  const fetchData = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error(
        L(
          "faMissingToken",
          "Please log in again. Your authentication token is missing."
        )
      );
    }

    const selectedLanguage = backendLanguage(language);

    const url =
      `${API_BASE_URL}/getAlAnalytics` +
      `?range=monthly&language=${encodeURIComponent(selectedLanguage)}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");

        throw new Error(
          L(
            "faSessionExpired",
            "Your login session has expired. Please log in again."
          )
        );
      }

      throw new Error(
        result.message ||
          result.error ||
          L("faLoadError", "We could not load your details")
      );
    }

    if (result.success === false) {
      throw new Error(
        result.message ||
          L("faLoadError", "We could not load your details")
      );
    }

    const normalized = normalize(result);

    setData(normalized);
  } catch (err) {
    console.error("Financial Advisor API error:", err);

    setError(
      err.message ||
        L("faLoadError", "We could not load your details")
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchData(); }, [language]);

  if (loading) {
    return (
      <div className="financial-advisor-page">
        <div className="financial-loading">
          <div className="financial-loading-spinner"><RefreshCw size={28} /></div>
          <h2>{L("faLoading", "Getting your money details...")}</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="financial-advisor-page">
        <div className="financial-error">
          <div className="financial-error-icon"><X size={28} /></div>
          <h2>{L("faLoadError", "We could not load your details")}</h2>
          <p>{error}</p>
          <button className="financial-retry-button" onClick={fetchData}>
            <RefreshCw size={17} /> {L("faRetry", "Try again")}
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  /* ---------- values ---------- */
  const { income, expense, balance } = data;
  const spentPct = income > 0 ? (expense / income) * 100 : 0;
  const rate = Math.max(0, Math.min(100, data.savingsRate || (income > 0 ? (balance / income) * 100 : 0)));
  const level = rate >= 20 ? "good" : rate >= 10 ? "ok" : "low";
  const levelText = {
    good: L("faRateGood", "Very good! You are saving well."),
    ok: L("faRateOk", "Okay. Try to save a little more."),
    low: L("faRateLow", "Low. Let us find ways to save more."),
  }[level];
  const compareText = (c) =>
    c === null
      ? L("faThisMonth", "This month")
      : `${Math.abs(c).toFixed(1)}% ${c >= 0 ? L("faMore", "more") : L("faLess", "less")} ${L("faThanLast", "than last month")}`;

  /* last 3 months */
  const base = [...data.history].reverse().slice(-3);
  const list = base.length ? base : [{ period: "current", income, expense, savings: balance }];
  const months = list.map((m, i) => {
    const inc = num(m.income), exp = num(m.expense);
    const saved = m.savings === undefined || m.savings === null ? inc - exp : num(m.savings);
    const back = list.length - 1 - i;
    const label =
      monthLabel(m.period, language) ||
      (back === 0 ? L("faThisMonth", "This month") : back === 1 ? L("faLastMonth", "Last month") : `${back} ${L("faMonthsAgo", "months ago")}`);
    return { label, now: back === 0, inc, exp, saved, rate: inc > 0 ? Math.max(0, Math.min(100, (saved / inc) * 100)) : 0 };
  });
  const maxVal = Math.max(...months.flatMap((m) => [m.inc, m.exp, Math.max(m.saved, 0)]), 1);
  const sum = months.reduce((s, m) => ({ inc: s.inc + m.inc, exp: s.exp + m.exp, saved: s.saved + m.saved }), { inc: 0, exp: 0, saved: 0 });

  /* donut */
  const cats = Object.entries(data.categoryWise)
    .map(([name, amount]) => ({ name, amount: num(amount), pct: num(data.categoryPercentages[name]) }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);
  const catTotal = cats.reduce((s, c) => s + c.amount, 0);
  const R = 78, C = 2 * Math.PI * R;
  const cur = activeCat !== null ? cats[activeCat] : null;
  let acc = 0;

  /* money health score */
  const score = data.health.score;
  const bands = [
    { c: "#dc2626", range: "0–39", label: L("faHealthLow", "Needs care"), text: L("faBandLow", "You spend most of what you earn, or you save very little. Small steps such as keeping a little aside every week can help a lot.") },
    { c: "#f59e0b", range: "40–59", label: L("faHealthOk", "Okay"), text: L("faBandOk", "You are managing, but not much is left over. Try to spend less on things you can skip, and save a fixed amount each month.") },
    { c: "#0d9488", range: "60–79", label: L("faHealthGood", "Good"), text: L("faBandGood", "You manage your money well. You spend less than you earn and you save regularly. A little more saving can take you to Very good.") },
    { c: "#059669", range: "80–100", label: L("faHealthStrong", "Very good"), text: L("faBandStrong", "Excellent! You save well, spend carefully and your income is steady. Keep this habit going.") },
  ];
  const youIdx = score >= 80 ? 3 : score >= 60 ? 2 : score >= 40 ? 1 : 0;
  const shown = bands[band ?? youIdx];

  const tabs = [
    ["month", Wallet, L("faTabMonth", "This month")],
    ["spending", PieChart, L("faTabSpending", "Where it went")],
    ["savings", PiggyBank, L("faTabSavings", "My savings")],
    ["advice", Lightbulb, L("faTabAdvice", "Advice")],
  ];
  const tips = String(data.suggestions || "")
  .split(/\n+/)
  .map((s) => s.trim())
  .filter(Boolean);
  const doneCount = tips.filter((_, i) => done[i]).length;

  return (
    <div className="financial-advisor-page">
      <header className="financial-advisor-header">
        <div className="financial-header-title">
          <h1>{L("faTitle", "Your Money Guide")}</h1>
          <p className="fa-subtitle">{L("faSubtitleFor", "Your money summary for")} {new Date().toLocaleDateString(LOCALES[language] || "en-IN", { month: "long", year: "numeric" })}</p>
        </div>
        <button className="financial-refresh-button" onClick={fetchData} title={L("faRefresh", "Refresh")} aria-label={L("faRefresh", "Refresh")}>
          <RefreshCw size={18} />
        </button>
      </header>

      <main className="financial-advisor-content">
        <nav className="fa-tabs" role="tablist">
          {tabs.map(([key, Icon, label]) => (
            <button key={key} role="tab" className="fa-tab" aria-selected={tab === key} onClick={() => setTab(key)}>
              <Icon size={18} /><span>{label}</span>
            </button>
          ))}
        </nav>

        {/* ---------- THIS MONTH ---------- */}
        {tab === "month" && (
          <div className="fa-pane">
            <section className="fa-hero">
              <p className="fa-hero-label">{L("faLeft", "Money left with you")}</p>
              <h2 className="fa-hero-amount">{rupees(balance)}</h2>
              <p className="fa-hero-sentence">
                {L("faYouEarned", "You earned")} <b>{rupees(income)}</b> {L("faAndSpent", "and spent")} <b>{rupees(expense)}</b>.
              </p>
              <div className="fa-kpis">
                <div className="fa-kpi"><span>{L("faEarnedShort", "Earned")}</span><strong>{compact(income)}</strong></div>
                <div className="fa-kpi"><span>{L("faSpentShort", "Spent")}</span><strong>{compact(expense)}</strong></div>
                <button className="fa-kpi fa-kpi-link" onClick={() => setTab("savings")}>
                  <span>{L("faViewRate", "Saving rate")}</span>
                  <strong>{rate.toFixed(0)}% <ArrowRight size={14} /></strong>
                </button>
              </div>
            </section>

            <section className="financial-summary-grid">
              <article className="financial-summary-card income-card">
                <div className="summary-card-top">
                  <div className="summary-icon income-icon"><Wallet size={20} /></div>
                  <Badge change={data.incomeChange} upIsGood />
                </div>
                <p className="summary-label">{L("faEarned", "Money you earned")}</p>
                <h2 className="summary-value">{rupees(income)}</h2>
                <p className="summary-footer">{compareText(data.incomeChange)}</p>
              </article>
              <article className="financial-summary-card expense-card">
                <div className="summary-card-top">
                  <div className="summary-icon expense-icon"><CreditCard size={20} /></div>
                  <Badge change={data.expenseChange} upIsGood={false} />
                </div>
                <p className="summary-label">{L("faSpent", "Money you spent")}</p>
                <h2 className="summary-value">{rupees(expense)}</h2>
                <p className="summary-footer">{spentPct.toFixed(0)}% {L("faOfEarned", "of what you earned")}</p>
              </article>
            </section>

            <section className="financial-panel overview-panel">
              <Head
                icon={BarChart3}
                title={L("faChartTitle", "Your last 3 months")}
                sub={L("faChartSub", "What you earned, spent and saved in each month")}
                extra={
                  <div className="fa-seg" role="tablist">
                    {[["amount", L("faViewAmount", "Amounts")], ["rate", L("faViewRate", "Saving rate")]].map(([k, l]) => (
                      <button key={k} role="tab" aria-selected={view === k} onClick={() => setView(k)}>{l}</button>
                    ))}
                  </div>
                }
              />

              <div className="fa-months" key={view}>
                {months.map((m, i) => {
                  const diff = i > 0 ? m.rate - months[i - 1].rate : null;
                  return (
                    <div className="fa-month" key={i}>
                      <div className="fa-month-head">
                        <h3>{m.label}</h3>
                        {m.now && <span className="fa-now">{L("faThisMonth", "This month")}</span>}
                        {view === "amount" && <span className="fa-month-rate">{L("faSavedShort", "Saved")} {m.rate.toFixed(0)}%</span>}
                      </div>

                      {view === "amount" ? (
                        [["earn", L("faEarnedShort", "Earned"), m.inc], ["spend", L("faSpentShort", "Spent"), m.exp], ["save", L("faSavedShort", "Saved"), m.saved]].map(([k, label, v]) => (
                          <div className={`fa-bar-row fa-row-${k}`} key={k}>
                            <span className="fa-bar-label">{label}</span>
                            <div className="fa-bar-track"><div className={`fa-bar fa-bar-${k}`} style={{ width: `${Math.max(2, (Math.max(v, 0) / maxVal) * 100)}%` }} /></div>
                            <strong className="fa-bar-value">{rupees(v)}</strong>
                          </div>
                        ))
                      ) : (
                        <>
                          <div className="fa-bar-row fa-rate-row">
                            <div className="fa-bar-track rate"><div className="fa-bar fa-bar-save" style={{ width: `${Math.max(2, m.rate)}%` }} /><i className="fa-goal-mark" /></div>
                            <strong className="fa-bar-value">{m.rate.toFixed(0)}%</strong>
                          </div>
                          <p className="fa-rate-note">
                            <span>{L("faYouKept", "You kept")} ₹{Math.round(m.rate)} {L("faFromEvery", "from every ₹100")}</span>
                            {diff !== null && (
                              <span className={`fa-change ${diff >= 0 ? "up" : "down"}`}>
                                {diff >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {Math.abs(diff).toFixed(0)}% {diff >= 0 ? L("faBetter", "better") : L("faLower", "lower")} {L("faThanBefore", "than the month before")}
                              </span>
                            )}
                          </p>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="fa-hint">
                <Info size={18} />
                <div>
                  {view === "amount" ? (
                    <>
                      <p>{L("faChartHint", "Each bar shows rupees. A longer bar means more money. Dark blue = earned, blue = spent, sky blue = saved.")}</p>
                      <p>{L("faOver", "In these months you earned")} <b>{rupees(sum.inc)}</b>, {L("faSpentWord", "spent")} <b>{rupees(sum.exp)}</b> {L("faAndSaved", "and saved")} <b>{rupees(sum.saved)}</b>.</p>
                    </>
                  ) : (
                    <p>{L("faRateHint", "The black line is your goal: keep ₹20 from every ₹100. A bar that reaches the line or goes past it means you are saving well.")}</p>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ---------- WHERE IT WENT ---------- */}
        {tab === "spending" && (
          <div className="fa-pane">
            <section className="financial-panel category-panel">
              <Head icon={PieChart} title={L("faWentTitle", "Where your money went")} sub={L("faWentSub", "Tap a name to see how much went there")} />
              <div className="category-content">
                <div className="donut-wrapper">
                  <svg className="donut-chart" viewBox="0 0 200 200">
                    <circle className="donut-background" cx="100" cy="100" r={R} />
                    {cats.map((c, i) => {
                      const p = catTotal > 0 ? (c.amount / catTotal) * 100 : 0;
                      const dash = (p / 100) * C;
                      const offset = -(acc / 100) * C;
                      acc += p;
                      return (
                        <circle key={c.name}
                          className={`donut-segment donut-color-${i} ${activeCat === null ? "" : activeCat === i ? "active" : "dim"}`}
                          cx="100" cy="100" r={R} strokeDasharray={`${Math.max(dash - 2, 0)} ${C}`} strokeDashoffset={offset} />
                      );
                    })}
                  </svg>
                  <div className="donut-center">
                    <span className="donut-center-label">{cur ? cur.name : L("faTotalSpent", "Total spent")}</span>
                    <strong>{compact(cur ? cur.amount : expense)}</strong>
                    {cur && <small className="donut-center-sub">{cur.pct.toFixed(0)}% {L("faOfSpending", "of your spending")}</small>}
                  </div>
                </div>
                <div className="category-list" onMouseLeave={() => setActiveCat(null)}>
                  {cats.length === 0 ? (
                    <p className="empty-chart">{L("faNoSpending", "No spending added yet.")}</p>
                  ) : (
                    cats.map((c, i) => (
                      <button type="button" key={c.name} className={`category-row ${activeCat === i ? "active" : ""}`}
                        onMouseEnter={() => setActiveCat(i)} onFocus={() => setActiveCat(i)} onBlur={() => setActiveCat(null)} onClick={() => setActiveCat(i)}>
                        <div className="category-name"><span className={`category-dot category-dot-${i}`} /><span>{c.name}</span></div>
                        <span className="category-value">{rupees(c.amount)} ({c.pct.toFixed(0)}%)</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
              <div className="fa-hint">
                <Info size={18} />
                <p>{L("faDonutHint", "The bigger the coloured slice, the more money went there.")}</p>
              </div>
            </section>
          </div>
        )}

        {/* ---------- MY SAVINGS ---------- */}
        {tab === "savings" && (
          <div className="fa-pane">
            <section className="financial-panel fa-rate">
              <Head icon={PiggyBank} tone="health-icon" title={L("faRateTitle", "How much you save")} sub={L("faRateSub", "Out of every ₹100 you earn, how much you keep")} />
              <div className="fa-rate-body">
                <div className="fa-rate-ring" style={{ "--p": `${rate * 3.6}deg` }}>
                  <div><strong>{rate.toFixed(0)}%</strong><span>{L("faSavedWord", "saved")}</span></div>
                </div>
                <div className="fa-rate-text">
                  <p className="fa-rate-big">{L("faYouKeep", "You keep")} <b>₹{Math.round(rate)}</b> {L("faOutOf", "out of every ₹100 you earn.")}</p>
                  <span className={`fa-status ${level}`}>{levelText}</span>
                  <div className="fa-goal">
                    <div className="fa-goal-track"><div className="fa-goal-fill" style={{ width: `${rate}%` }} /><i className="fa-goal-mark" /></div>
                    <p className="fa-goal-text">{L("faGoal", "Goal: keep at least ₹20 from every ₹100")}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="financial-middle-grid">
              <div className="financial-panel health-panel">
                <Head icon={CircleDollarSign} tone="health-icon" title={L("faHealthTitle", "Your money health score")} sub={L("faHealthSub", "One number out of 100")}
                  extra={<span className="health-status">{bands[youIdx].label}</span>} />
                <div className="health-score-area">
                  <div className="health-ring" style={{ "--health-progress": `${Math.min(score, 100) * 3.6}deg` }}>
                    <div className="health-ring-inner"><strong>{score}</strong><span>/ 100</span></div>
                  </div>
                </div>
                <div className="health-metrics">
                  <div className="health-metric"><span>{L("faSavedShort", "Saved")}</span><strong>{data.health.saving.toFixed(0)}%</strong></div>
                  <div className="health-metric"><span>{L("faSpentShort", "Spent")}</span><strong>{data.health.expenseRatio.toFixed(0)}%</strong></div>
                  <div className="health-metric"><span>{L("faSteady", "Steady income")}</span><strong>{data.health.stability}</strong></div>
                </div>
              </div>

              <div className="financial-panel">
                <Head icon={Info} title={L("faMeanTitle", "What does my score mean?")} sub={L("faMeanSub", "Tap a box to read its meaning")} />
                <div className="fa-scale">
                  {bands.map((b, i) => (
                    <button key={i} className="fa-band" style={{ "--c": b.c }} aria-pressed={(band ?? youIdx) === i} onClick={() => setBand(i)}>
                      <em className={`fa-you ${i === youIdx ? "on" : ""}`}>{L("faYou", "You")}</em>
                      {b.label}<small>{b.range}</small>
                    </button>
                  ))}
                </div>
                <div className="fa-band-text" style={{ "--c": shown.c }}>
                  <h3>{shown.label}</h3>
                  <p>{shown.text}</p>
                </div>
                <ul className="fa-factors">
                  <li><b>{L("faSavedShort", "Saved")}</b><span>{L("faF1", "How much of your earning you keep.")}</span></li>
                  <li><b>{L("faSpentShort", "Spent")}</b><span>{L("faF2", "How much of your earning you use.")}</span></li>
                  <li><b>{L("faSteady", "Steady income")}</b><span>{L("faF3", "Whether you earn about the same each month.")}</span></li>
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* ---------- ADVICE ---------- */}
        {tab === "advice" && (
          <div className="fa-pane">
            <section className="financial-panel recommendations-panel">
              <Head icon={Lightbulb} tone="recommendation-icon" title={L("faAdviceTitle", "Advice for you")} sub={L("faAdviceSub", "Tap a tip when you have done it")} />
              {tips.length > 0 && <p className="fa-progress">{doneCount} {L("faOf", "of")} {tips.length} {L("faDone", "done")}</p>}
              <div className="recommendation-list">
                {tips.length === 0 && <p className="empty-chart">{L("faNoAdvice", "No advice yet. Add more income and spending to get tips.")}</p>}
                {tips.map((line, i) => (
                  <button type="button" key={i} className="recommendation-item" aria-pressed={!!done[i]} onClick={() => setDone((d) => ({ ...d, [i]: !d[i] }))}>
                    <div className="recommendation-item-icon"><CheckCircle2 size={17} /></div>
                    <div className="recommendation-content"><p>{line}</p></div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
{/*import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, CheckCircle2, CircleDollarSign, CreditCard, Lightbulb, PieChart, RefreshCw, TrendingDown, TrendingUp, Wallet, X, } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { T } from "./data";
import "./FinancialAdvisor.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";*/}

/* ---------------------------------------
   LANGUAGE CONVERSION
--------------------------------------- */

{/*function getBackendLanguage(language) {
  if (language === "hi") {
    return "Hindi";
  }

  if (language === "mr") {
    return "Marathi";
  }

  return "English";
}*/}

// 
/* ---------------------------------------
   FORMAT RUPEES
--------------------------------------- */

{/*function formatRupees(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "₹0";
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(number);
}*/}

/* ---------------------------------------
   FORMAT COMPACT RUPEES
--------------------------------------- */

{/*function formatCompactRupees(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "₹0";
  }

  if (Math.abs(number) >= 10000000) {
    return `₹${(
      number / 10000000
    ).toFixed(1)}Cr`;
  }

  if (Math.abs(number) >= 100000) {
    return `₹${(
      number / 100000
    ).toFixed(1)}L`;
  }

  if (Math.abs(number) >= 1000) {
    return `₹${(
      number / 1000
    ).toFixed(1)}K`;
  }

  return `₹${Math.round(number)}`;
}*/}


/* ---------------------------------------
   BACKEND DATA NORMALIZATION
--------------------------------------- */

{/*function normalizeFinancialData(result) {
  const raw = result?.data || {};

  const financial = raw.financial || {};

  const spendingPattern = raw.spendingPattern || {};

  const categoryAnalysis = raw.categoryAnalysis || {};

  const health = raw.financialHealth || {};

  return {
    totalIncome:
      Number(financial.totalIncome) || 0,

    totalExpenses:
      Number(financial.totalExpense) || 0,

    availableBalance:
      Number(financial.availableBalance) || 0,

    savingsRate:
      Number(financial.savingsRate) || 0,

    highestExpense:
      Number(financial.highestExpense) || 0,

    lowestExpense:
      Number(financial.lowestExpense) || 0,

    averageExpense:
      Number(financial.averageExpense) || 0,


    history:
      Array.isArray(
        spendingPattern.history
      )
        ? spendingPattern.history
        : [],

    incomeChange:
      spendingPattern?.comparison?.income
        ?.percentageChange ?? null,

    expenseChange:
      spendingPattern?.comparison?.expense
        ?.percentageChange ?? null,

    categoryWise:
      categoryAnalysis.CategoryWise || {},

    categoryPercentages:
      categoryAnalysis.CategoryPercentages ||
      {},

    maxCategory:
      categoryAnalysis.MaxCategory || "",

    maxPercentage:
      Number(
        categoryAnalysis.MaxPercentage
      ) || 0,


    health: {
      score:
        Number(health.score) || 0,

      saving:
        Number(health.saving) || 0,

      expenseRatio:
        Number(health.expenseRatio) || 0,

      stabilityScore:
        Number(
          health.stabilityScore
        ) || 0,
    },


    suggestions:
      raw.personalizedSuggestions ||
      "No suggestions available.",

    anomalies:
      Array.isArray(raw.anomalies)
        ? raw.anomalies
        : [],
  };
}
*/}

/* ---------------------------------------
   MAIN COMPONENT
--------------------------------------- */

{/*export default function FinancialAdvisor({
  language,
}) {

  const navigate = useNavigate();

  const t = T[language] || T.en;
  const backendLanguage = getBackendLanguage(language);
  const [financialData, setFinancialData,] = useState(null);
  const [loading, setLoading,] = useState(true);
  const [error, setError,] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchFinancialData =
    async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {
          throw new Error(
            "Please login again. Authentication token is missing."
          );
        }

        const url =
          `${API_BASE_URL}/getAlAnalytics` +
          `?range=monthly` +
          `&language=${encodeURIComponent(
            backendLanguage
          )}`;


        const response =
          await fetch(url, {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          });


        const result =
          await response.json();


        if (!response.ok) {

          if (
            response.status === 401 ||
            response.status === 403
          ) {
            localStorage.removeItem(
              "token"
            );

            throw new Error(
              "Your login session has expired. Please login again."
            );
          }

          throw new Error(
            result.message ||
            result.error ||
            `Request failed with status ${response.status}`
          );
        }


        if (!result.success) {
          throw new Error(
            result.message ||
            "Unable to load financial data."
          );
        }


        const normalized =
          normalizeFinancialData(
            result
          );


        setFinancialData(
          normalized
        );

      } catch (err) {

        console.error(
          "Financial Advisor API error:",
          err
        );

        setError(
          err.message ||
          "Unable to load financial data."
        );

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {
    fetchFinancialData();
  }, [language]);*/


  /* ---------------------------------------
     CALCULATED VALUES
  --------------------------------------- */

  {/*const expensePercentage =
    useMemo(() => {

      if (
        !financialData ||
        financialData.totalIncome <= 0
      ) {
        return 0;
      }

      return (
        financialData.totalExpenses /
        financialData.totalIncome
      ) * 100;

    }, [financialData]);


  const savings = financialData ? financialData.availableBalance : 0;

  const healthStatus =
    useMemo(() => {
      const score =
        financialData?.health?.score ||
        0;

      if (score >= 80) {
        return "Strong";
      }

      if (score >= 60) {
        return "Good";
      }

      if (score >= 40) {
        return "Moderate";
      }

      return "Needs attention";

    }, [financialData]);*/}


  /* ---------------------------------------
     LOADING
  --------------------------------------- */

  {/*if (loading) {

    return (
      <div className="financial-advisor-page">
        <div className="financial-loading">
          <div className="financial-loading-spinner">
            <RefreshCw size={28} />
          </div>
          <h2>
            {t.loadingFinancialData ||
              "Loading financial data..."}
          </h2>
        </div>
      </div>
    );
  }
*/}

  /* ---------------------------------------
     ERROR
  --------------------------------------- */

  {/*if (error) {
    return (
      <div className="financial-advisor-page">
        <div className="financial-error">
          <div className="financial-error-icon">
            <X size={28} />
          </div>
          <h2>
            {t.unableToLoadFinancialData ||
              "Unable to load financial data"}
          </h2>
          <p>{error}</p>
          <button className="financial-retry-button"
            onClick={fetchFinancialData}>
            <RefreshCw size={17} />
            {t.retry || "Retry"}
          </button>
        </div>
      </div>
    );
  }

  if (!financialData) {
    return null;
  }*/}


  /* ---------------------------------------
     CHART DATA
  --------------------------------------- */

  {/*const history =
    [...financialData.history]
      .reverse()
      .slice(-4);


  const chartItems =
    history.length > 0
      ? history
      : [
        {
          period: "current",
          income:
            financialData.totalIncome,
          expense:
            financialData.totalExpenses,
          savings,
        },
      ];


  const maxChartValue =
    Math.max(
      ...chartItems.flatMap(
        (item) => [
          Number(item.income) || 0,
          Number(item.expense) || 0,
          Number(item.savings) || 0,
        ]
      ),
      1
    );*/}


  /* ---------------------------------------
     CATEGORY DATA
  --------------------------------------- */

  {/*const categories =
    Object.entries(
      financialData.categoryWise
    )
      .map(
        ([name, amount]) => ({
          name,
          amount:
            Number(amount) || 0,
          percentage:
            Number(
              financialData
                .categoryPercentages[
              name
              ]
            ) || 0,
        })
      )
      .filter(
        (item) =>
          item.amount > 0
      )
      .sort(
        (a, b) =>
          b.amount - a.amount
      )
      .slice(0, 6);


  const totalCategoryExpense =
    categories.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );*/}


  /* ---------------------------------------
     DONUT SVG
  --------------------------------------- */

  {/*const radius = 78;

  const circumference =
    2 * Math.PI * radius;

  let accumulatedPercentage = 0;*/}


  /* ---------------------------------------
     MAIN UI
  --------------------------------------- */

  /*return (
    <div className="financial-advisor-page">*/

      {/* HEADER */}

     /* <header className="financial-advisor-header">
        <div className="financial-header-title">
            <h1>{t.financialAdvisorTitle || "Financial Advisor"}</h1>
        </div>

        <button
          className="financial-refresh-button"
          onClick={fetchFinancialData}
          title={t.retry || "Refresh"}>
          <RefreshCw size={18} />
        </button>
      </header>*/


      {/* MAIN */}

      /*<main className="financial-advisor-content">*/

        {/* SUMMARY */}

       /* <section className="financial-summary-grid">*/

          {/* INCOME */}

          /*<article className="financial-summary-card income-card">

            <div className="summary-card-top">

              <div className="summary-icon income-icon">
                <Wallet size={20} />
              </div>

              {financialData.incomeChange !==
                null && (
                  <span
                    className={`percentage-badge ${financialData.incomeChange >=
                        0
                        ? "positive"
                        : "negative"
                      }`}
                  >

                    {financialData.incomeChange >=
                      0 ? (
                      <TrendingUp
                        size={13}
                      />
                    ) : (
                      <TrendingDown
                        size={13}
                      />
                    )}

                    {Math.abs(
                      financialData.incomeChange
                    ).toFixed(1)}
                    %

                  </span>
                )}

            </div>

            <p className="summary-label">
              {t.totalIncome ||
                "TOTAL INCOME"}
            </p>

            <h2 className="summary-value">
              {formatRupees(
                financialData.totalIncome
              )}
            </h2>

            <p className="summary-footer">
              {t.vsLastMonth ||
                "Current period"}
            </p>

          </article>*/


          {/* EXPENSE */}

          /*<article className="financial-summary-card expense-card">

            <div className="summary-card-top">

              <div className="summary-icon expense-icon">
                <CreditCard size={20} />
              </div>

              {financialData.expenseChange !==
                null && (
                  <span
                    className={`percentage-badge ${financialData.expenseChange <=
                        0
                        ? "positive"
                        : "negative"
                      }`}
                  >

                    {financialData.expenseChange <=
                      0 ? (
                      <TrendingDown
                        size={13}
                      />
                    ) : (
                      <TrendingUp
                        size={13}
                      />
                    )}

                    {Math.abs(
                      financialData.expenseChange
                    ).toFixed(1)}
                    %

                  </span>
                )}

            </div>

            <p className="summary-label">
              {t.totalExpenses ||
                "TOTAL EXPENSES"}
            </p>

            <h2 className="summary-value">
              {formatRupees(
                financialData.totalExpenses
              )}
            </h2>

            <p className="summary-footer">
              {expensePercentage.toFixed(1)}%
              {" "}
              {t.ofIncome ||
                "of income"}
            </p>

          </article>

        </section>*/


        {/* BAR CHART */}

        /*<section className="financial-panel overview-panel">

          <div className="panel-header">

            <div className="panel-title-wrapper">

              <div className="panel-icon">
                <BarChart3 size={18} />
              </div>

              <div>
                <h2>
                  {t.incomeExpensesOverview ||
                    "Income & Expense Overview"}
                </h2>

                <p>
                  {t.lastFourPeriods ||
                    "Recent financial periods"}
                </p>
              </div>

            </div>

          </div>


          <div className="bar-chart-container">

            <svg
              className="bar-chart"
              viewBox="0 0 700 270"
              preserveAspectRatio="none"
            >

              {[0, 1, 2, 3, 4].map(
                (line) => {

                  const y =
                    30 + line * 48;

                  return (
                    <line
                      key={line}
                      className="chart-grid-line"
                      x1="45"
                      x2="680"
                      y1={y}
                      y2={y}
                    />
                  );
                }
              )}


              {chartItems.map(
                (item, index) => {

                  const groupWidth =
                    150;

                  const startX =
                    60 +
                    index *
                    groupWidth;

                  const barWidth = 25;

                  const incomeHeight =
                    ((Number(
                      item.income
                    ) || 0) /
                      maxChartValue) *
                    190;

                  const expenseHeight =
                    ((Number(
                      item.expense
                    ) || 0) /
                      maxChartValue) *
                    190;

                  const savingsHeight =
                    ((Number(
                      item.savings
                    ) || 0) /
                      maxChartValue) *
                    190;

                  const baseY = 225;

                  return (
                    <g key={index}>

                      <rect
                        className="bar-income"
                        x={startX}
                        y={
                          baseY -
                          incomeHeight
                        }
                        width={barWidth}
                        height={
                          incomeHeight
                        }
                        rx="3"
                      />

                      <rect
                        className="bar-expenses"
                        x={
                          startX +
                          32
                        }
                        y={
                          baseY -
                          expenseHeight
                        }
                        width={barWidth}
                        height={
                          expenseHeight
                        }
                        rx="3"
                      />

                      <rect
                        className="bar-savings"
                        x={
                          startX +
                          64
                        }
                        y={
                          baseY -
                          savingsHeight
                        }
                        width={barWidth}
                        height={
                          savingsHeight
                        }
                        rx="3"
                      />

                      <text
                        className="chart-month-text"
                        x={
                          startX + 32
                        }
                        y="250"
                        textAnchor="middle"
                      >
                        {item.period ===
                          "current"
                          ? "Current"
                          : `${index + 1}`}
                      </text>

                    </g>
                  );
                }
              )}


              <text
                className="chart-axis-text"
                x="5"
                y="35"
              >
                {formatCompactRupees(
                  maxChartValue
                )}
              </text>

              <text
                className="chart-axis-text"
                x="15"
                y="225"
              >
                ₹0
              </text>

            </svg>


            <div className="chart-legend">

              <span>
                <i className="legend-box legend-income" />
                {t.income || "Income"}
              </span>

              <span>
                <i className="legend-box legend-expenses" />
                {t.expenses || "Expenses"}
              </span>

              <span>
                <i className="legend-box legend-savings" />
                {t.savings || "Savings"}
              </span>

            </div>

          </div>

        </section>*/


        {/* MIDDLE GRID */}

        /*<section className="financial-middle-grid">*/

          {/* CATEGORY */}

         /* <div className="financial-panel category-panel">

            <div className="panel-header">

              <div className="panel-title-wrapper">

                <div className="panel-icon">
                  <PieChart size={18} />
                </div>

                <div>
                  <h2>
                    {t.categoryWiseExpenses ||
                      "Category-wise Expenses"}
                  </h2>

                  <p>
                    {t.spendingByCategory ||
                      "Where your money is going"}
                  </p>
                </div>

              </div>

            </div>


            <div className="category-content">

              <div className="donut-wrapper">

                <svg
                  className="donut-chart"
                  viewBox="0 0 200 200"
                >

                  <circle
                    className="donut-background"
                    cx="100"
                    cy="100"
                    r={radius}
                  />


                  {categories.map(
                    (category, index) => {

                      const percentage =
                        totalCategoryExpense >
                          0
                          ? (category.amount /
                            totalCategoryExpense) *
                          100
                          : 0;

                      const dash =
                        (percentage /
                          100) *
                        circumference;

                      const gap = 2;

                      const dashOffset =
                        -(
                          accumulatedPercentage /
                          100
                        ) *
                        circumference;

                      accumulatedPercentage +=
                        percentage;

                      return (
                        <circle
                          key={
                            category.name
                          }
                          className={`donut-segment donut-color-${index}`}
                          cx="100"
                          cy="100"
                          r={radius}
                          strokeDasharray={`${Math.max(
                            dash - gap,
                            0
                          )} ${circumference}`}
                          strokeDashoffset={
                            dashOffset
                          }
                        />
                      );
                    }
                  )}

                </svg>


                <div className="donut-center">

                  <span className="donut-center-label">
                    {t.totalExpenses ||
                      "TOTAL"}
                  </span>

                  <strong>
                    {formatCompactRupees(
                      financialData.totalExpenses
                    )}
                  </strong>

                </div>

              </div>


              <div className="category-list">

                {categories.length ===
                  0 ? (
                  <p className="empty-chart">
                    No expense data available.
                  </p>
                ) : (
                  categories.map(
                    (
                      category,
                      index
                    ) => (
                      <div
                        className="category-row"
                        key={
                          category.name
                        }
                      >

                        <div className="category-name">

                          <span
                            className={`category-dot category-dot-${index}`}
                          />

                          <span>
                            {
                              category.name
                            }
                          </span>

                        </div>

                        <span className="category-value">
                          {formatRupees(
                            category.amount
                          )}
                          {" "}
                          (
                          {category.percentage.toFixed(
                            1
                          )}
                          %)
                        </span>

                      </div>
                    )
                  )
                )}

              </div>

            </div>

          </div>*/


          {/* HEALTH */}

          /*<div className="financial-panel health-panel">

            <div className="panel-header">

              <div className="panel-title-wrapper">

                <div className="panel-icon health-icon">
                  <CircleDollarSign
                    size={18}
                  />
                </div>

                <div>
                  <h2>
                    {t.financialHealth ||
                      "Financial Health"}
                  </h2>

                  <p>
                    {t.healthScoreSubtitle ||
                      "Based on your financial activity"}
                  </p>
                </div>

              </div>

              <span className="health-status">
                {healthStatus}
              </span>

            </div>


            <div className="health-score-area">

              <div
                className="health-ring"
                style={{
                  "--health-progress":
                    `${Math.min(
                      financialData.health.score,
                      100
                    ) * 3.6}deg`,
                }}
              >

                <div className="health-ring-inner">

                  <strong>
                    {financialData.health.score}
                  </strong>

                  <span>/ 100</span>
                </div>
              </div>
            </div>

            <div className="health-metrics">
              <div className="health-metric">
                <span> Saving</span>
                <strong>
                  {financialData.health.saving.toFixed(1)} %</strong>
              </div>

              <div className="health-metric">
                <span>
                  Expense
                </span>
                <strong>
                  {financialData.health.expenseRatio.toFixed(
                    1
                  )}
                  %
                </strong>
              </div>

              <div className="health-metric">

                <span>
                  Stability
                </span>

                <strong>
                  {financialData.health.stabilityScore}
                </strong>
              </div>
            </div>
          </div>
        </section>*/


        {/* SHOW/HIDE FINANCIAL SUGGESTIONS BUTTON */}

       /* <div className="suggestions-button-container">
          <button type="button" className="suggestions-toggle-button"
            onClick={() => setShowSuggestions((prev) => !prev)}>
            <Lightbulb size={18} />
            {showSuggestions ? "Hide Financial Suggestions" : "Show Financial Suggestions"}
          </button>
        </div>*/

        {/* AI SUGGESTION */}

       /* { showSuggestions && (<section className="financial-panel recommendations-panel">
          <div className="panel-header">
            <div className="panel-title-wrapper">
              <div className="panel-icon recommendation-icon">
                <Lightbulb size={18} />
              </div>
              <div>
                <h2>{t.financialSuggestions || "Financial Suggestions"}</h2>
                <p>{t.personalizedAdvice || "Personalized advice based on your financial data"}
                </p>
              </div>
            </div>
          </div>


          <div className="recommendation-list">
            <div className="recommendation-item">
              <div className="recommendation-item-icon">
                <CheckCircle2 size={17} />
              </div>
              <div className="recommendation-content">
                <h3>AI Financial Advice</h3>
                <p>{financialData.suggestions}</p>
              </div>
            </div>

            
            
          </div>
        </section>)}*/


        {/* SAVINGS STRIP */}

      /*</main>*/
    /*</div>*/
  /*);*/
}
