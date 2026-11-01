import { useState } from "react";
import { Clock3, MapPin, Wallet, Sprout, ArrowRight, Check } from "lucide-react";

const skillKeys = ["Cooking", "Tailoring", "Farming", "Animal husbandry", "Crafts", "Technical work", "Retail", "Beauty services", "Machinery"];
const experienceKeys = ["beginner", "intermediate", "experienced"];

export default function ProfileForm({ t, onSubmit, isLoading }) {
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState([]);
  const [hours, setHours] = useState("4");
  const [land, setLand] = useState("no");
  const [experience, setExperience] = useState("beginner");
  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [errors, setErrors] = useState({});

  function toggleSkill(skill) {
    setSkills((current) => current.includes(skill) ? [] : [skill]);
    setErrors((current) => ({ ...current, skills: "" }));
  }

  function validate() {
    const next = {};
    const amount = Number(budget);
    if (!budget.trim() || !Number.isFinite(amount) || amount <= 0) next.budget = t("validationBudget");
    if (!skills.length) next.skills = t("validationSkills");
    if (!Number.isFinite(Number(hours)) || Number(hours) < 1 || Number(hours) > 24) next.hours = t("validationHours");
    if (village.trim().length > 100) next.village = t("validationVillage");
    if (district.trim().length > 100) next.district = t("validationDistrict");
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;
    onSubmit({
      budget_inr: Number(budget),
      skills,
      available_hours_per_day: Number(hours),
      land_available: land === "yes",
      experience: experience.charAt(0).toUpperCase() + experience.slice(1),
      village: village.trim(),
      district: district.trim()
    });
  }

  return (
    <section className="form-section" id="profile">
      <div className="section-heading">
        <span className="section-icon"><Sprout size={22} /></span>
        <p className="eyebrow">YOUR PROFILE</p>
        <h1>{t("profileTitle")}</h1>
        <p className="muted">{t("profileSubtitle")}</p>
      </div>

      <form className="profile-card" onSubmit={handleSubmit} noValidate>
        <div className="form-grid">
          <div className="field field-full">
            <label htmlFor="budget"><span className="label-icon"><Wallet size={16} /></span>{t("budget")} <span className="required">*</span></label>
            <div className={`input-shell ${errors.budget ? "has-error" : ""}`}>
              <span className="currency-symbol">₹</span>
              <input
                id="budget"
                type="number"
                min="1"
                step="any"
                inputMode="decimal"
                placeholder={t("budgetPlaceholder")}
                value={budget}
                onChange={(event) => { setBudget(event.target.value); setErrors((old) => ({ ...old, budget: "" })); }}
                aria-invalid={Boolean(errors.budget)}
                aria-describedby={errors.budget ? "budget-error" : "budget-hint"}
              />
            </div>
            {errors.budget ? <p className="field-error" id="budget-error">{errors.budget}</p> : <p className="field-hint" id="budget-hint">{t("budgetHint")}</p>}
          </div>

          <fieldset className="field field-full fieldset-reset">
            <legend>{t("skills")} <span className="required">*</span></legend>
            <p className="field-hint">{t("skillsHint")}</p>
            <div className="skill-grid">
              {skillKeys.map((skill) => {
                const active = skills.includes(skill);
                return (
                  <button type="button" key={skill} className={`skill-chip ${active ? "active" : ""}`} onClick={() => toggleSkill(skill)} aria-pressed={active}>
                    <span className="skill-check">{active ? <Check size={13} /> : null}</span>
                    {t(`skillsOptions.${skill}`)}
                  </button>
                );
              })}
            </div>
            {errors.skills && <p className="field-error">{errors.skills}</p>}
          </fieldset>

          <div className="field">
            <label htmlFor="hours"><span className="label-icon"><Clock3 size={16} /></span>{t("hours")}</label>
            <div className="hours-control">
              <input id="hours" type="number" min="1" max="24" step="1" value={hours} onChange={(event) => setHours(event.target.value)} aria-invalid={Boolean(errors.hours)} />
              <span>{t("hoursUnit")}</span>
            </div>
            {errors.hours && <p className="field-error">{errors.hours}</p>}
          </div>

          <fieldset className="field fieldset-reset">
            <legend>{t("land")}</legend>
            <div className="segmented-control">
              {["yes", "no"].map((value) => (
                <button type="button" key={value} onClick={() => setLand(value)} className={land === value ? "active" : ""} aria-pressed={land === value}>
                  {t(value)}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field field-full fieldset-reset">
            <legend>{t("experience")}</legend>
            <div className="experience-grid">
              {experienceKeys.map((key) => (
                <button type="button" key={key} className={`experience-option ${experience === key ? "active" : ""}`} onClick={() => setExperience(key)} aria-pressed={experience === key}>
                  <span className="experience-radio" />
                  <span><strong>{t(key)}</strong><small>{t(`${key}Desc`)}</small></span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="field field-full location-heading">
            <h2><MapPin size={18} /> {t("location")}</h2>
            <p className="field-hint">{t("locationOptional")}</p>
          </div>
          <div className="field">
            <label htmlFor="village">{t("village")}</label>
            <input className="text-input" id="village" maxLength="100" value={village} onChange={(event) => setVillage(event.target.value)} placeholder={t("villagePlaceholder")} />
            {errors.village && <p className="field-error">{errors.village}</p>}
          </div>
          <div className="field">
            <label htmlFor="district">{t("district")}</label>
            <input className="text-input" id="district" maxLength="100" value={district} onChange={(event) => setDistrict(event.target.value)} placeholder={t("districtPlaceholder")} />
            {errors.district && <p className="field-error">{errors.district}</p>}
          </div>
        </div>
        <div className="form-actions form-actions-end">
          
          <button type="submit" className="button button-primary" disabled={isLoading}>
            {isLoading ? t("loadingTitle") : t("submit")} <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </section>
  );
}

