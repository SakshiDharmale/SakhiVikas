import React, { useState } from "react";
import { Lightbulb } from "lucide-react";
import { T } from "./data";
import "./BusinessRecommendations.css";

const modelOutputTranslations = {
  hi: {
    businesses: {
      "Dairy Farming": "डेयरी फार्मिंग", "Goat Farming": "बकरी पालन", "Poultry Farming": "मुर्गी पालन",
      "Mushroom Farming": "मशरूम की खेती", "Vegetable Farming": "सब्ज़ी की खेती", "Papad Making": "पापड़ बनाना",
      "Pickle Making": "अचार बनाना", "Homemade Snacks": "घर के बने नाश्ते", "Tiffin Service": "टिफिन सेवा",
      Tailoring: "सिलाई", Embroidery: "कढ़ाई", "Beauty Service": "ब्यूटी सेवा", "Candle Making": "मोमबत्ती बनाना",
      "Soap Making": "साबुन बनाना", "Agarbatti Making": "अगरबत्ती बनाना", Nursery: "नर्सरी", "Flower Farming": "फूलों की खेती",
      "Flour Mill": "आटा चक्की", "Grocery Shop": "किराना दुकान", "Mobile Repair": "मोबाइल मरम्मत", "Computer Service": "कंप्यूटर सेवा",
      Handicraft: "हस्तशिल्प", "Bamboo Products": "बांस के उत्पाद", "Clothing Reselling": "कपड़ों की बिक्री",
      "Spice Powder": "मसाला पाउडर", "Millet Products": "मोटे अनाज के उत्पाद", "Goat Feed Production": "बकरी का चारा बनाना",
      "Milk Products": "दूध के उत्पाद", "Food Stall": "खाने का स्टॉल", "Online Selling": "ऑनलाइन बिक्री",
    },
    reasons: {
      "Your investment fits the estimated investment range.": "आपका निवेश अनुमानित निवेश सीमा में है।",
      "Your skill matches the required skill.": "आपका कौशल आवश्यक कौशल से मेल खाता है।",
      "Your available time is sufficient.": "आपके पास पर्याप्त समय उपलब्ध है।",
      "This business does not require land.": "इस व्यवसाय के लिए जमीन की आवश्यकता नहीं है।",
      "The dataset indicates high demand.": "आंकड़ों के अनुसार इसकी मांग अधिक है।",
      "This business was selected based on the model's ranking.": "यह व्यवसाय मॉडल की रैंकिंग के आधार पर चुना गया है।",
    },
    empty: "कोई सुझाव नहीं मिला। अपनी जानकारी में बदलाव करके फिर कोशिश करें।",
  },
  mr: {
    businesses: {
      "Dairy Farming": "दुग्ध व्यवसाय", "Goat Farming": "शेळीपालन", "Poultry Farming": "कुक्कुटपालन",
      "Mushroom Farming": "अळींबी शेती", "Vegetable Farming": "भाजीपाला शेती", "Papad Making": "पापड बनवणे",
      "Pickle Making": "लोणचे बनवणे", "Homemade Snacks": "घरगुती फराळ", "Tiffin Service": "डबा सेवा",
      Tailoring: "शिवणकाम", Embroidery: "भरतकाम", "Beauty Service": "सौंदर्य सेवा", "Candle Making": "मेणबत्ती बनवणे",
      "Soap Making": "साबण बनवणे", "Agarbatti Making": "अगरबत्ती बनवणे", Nursery: "रोपवाटिका", "Flower Farming": "फुलशेती",
      "Flour Mill": "पीठ गिरणी", "Grocery Shop": "किराणा दुकान", "Mobile Repair": "मोबाईल दुरुस्ती", "Computer Service": "संगणक सेवा",
      Handicraft: "हस्तकला", "Bamboo Products": "बांबू उत्पादने", "Clothing Reselling": "कपड्यांची विक्री",
      "Spice Powder": "मसाला पावडर", "Millet Products": "भरड धान्य उत्पादने", "Goat Feed Production": "शेळीचा चारा उत्पादन",
      "Milk Products": "दुग्धजन्य पदार्थ", "Food Stall": "खाद्यपदार्थांचा स्टॉल", "Online Selling": "ऑनलाइन विक्री",
    },
    reasons: {
      "Your investment fits the estimated investment range.": "तुमची गुंतवणूक अंदाजित गुंतवणूक मर्यादेत आहे।",
      "Your skill matches the required skill.": "तुमचे कौशल्य आवश्यक कौशल्याशी जुळते।",
      "Your available time is sufficient.": "तुमच्याकडे पुरेसा वेळ उपलब्ध आहे।",
      "This business does not require land.": "या व्यवसायासाठी जमिनीची आवश्यकता नाही।",
      "The dataset indicates high demand.": "माहितीनुसार या व्यवसायाला जास्त मागणी आहे।",
      "This business was selected based on the model's ranking.": "हा व्यवसाय मॉडेलच्या क्रमवारीनुसार निवडला आहे।",
    },
    empty: "कोणत्याही शिफारसी सापडल्या नाहीत. माहिती बदलून पुन्हा प्रयत्न करा.",
  },
};

const BusinessRecommendations = ({ language = "en" }) => {
  const t = T[language] || T.en;

  const [formData, setFormData] = useState({
    investment: "",
    landAvailability: "",
    businessCategory: "",
    riskPreference: "",
    experience: "",
    skills: "",
    location: "",
    availableTime: "",
    seasonalAvailability: "",
    incomeGoal: "",
  });

  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuggestion(null);

    setError("");
    try {
      const apiUrl = (import.meta.env.VITE_RECOMMENDATION_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
      const response = await fetch(`${apiUrl}/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investment: Number(formData.investment),
          available_time: Number(formData.availableTime),
          skill: formData.skills,
          land: formData.landAvailability === "yes" ? 1 : 0,
          experience: { beginner: 0, "1-2_years": 2, "3+_years": 3 }[formData.experience],
        }),
        signal: AbortSignal.timeout(30000),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Please check your profile and try again.");
      }
      if (!Array.isArray(data.recommendations)) throw new Error("Invalid recommendation response.");
      setSuggestion(data.recommendations);
    } catch (error) {
      setError(error.message || "Unable to reach the recommendation service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="business-recommendation-page">

      {/* =====================================================
          MAIN FORM CARD
          ===================================================== */}

      <div className="business-recommendation-card">
        {/* Header */}
        <div className="recommendation-header">
          <div className="recommendation-icon">
            <Lightbulb size={30} />
          </div>

          <div>
            <h1>{t.businessRecommendation}</h1>

            <p>
              {t.businessRecommendationSubtitle}
            </p>
          </div>
        </div>


        <form onSubmit={handleSubmit}>

          {/* =================================================
              1. CAPITAL & RESOURCES
              ================================================= */}

          <div className="recommendation-section">

            <h2>
              {t.capitalResources}
            </h2>

            <div className="recommendation-grid">

              {/* Available Investment */}
              <div className="recommendation-field">
                <label>
                  {t.availableInvestment}
                </label>

                <input
                  type="number"
                  name="investment"
                  value={formData.investment}
                  onChange={handleChange}
                  placeholder={t.enterInvestment}
                  min="1"
                  required
                />

              </div>


              {/* Land Availability */}
              <div className="recommendation-field">

                <label>
                  {t.landAvailability}
                </label>

                <select
                  name="landAvailability"
                  value={formData.landAvailability}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {t.selectLand}
                  </option>

                  <option value="yes">
                    {t.yes}
                  </option>

                  <option value="no">
                    {t.no}
                  </option>
                </select>

              </div>

            </div>
          </div>


          {/* =================================================
              2. EXPERIENCE & PREFERENCES
              ================================================= */}

          <div className="recommendation-section">

            <h2>
              {t.experiencePreferences}
            </h2>

            <div className="recommendation-grid">

              {/* Business Category */}
              <div className="recommendation-field">

                <label>
                  {t.businessCategory}
                </label>

                <select
                  name="businessCategory"
                  value={formData.businessCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {t.selectBusinessCategory}
                  </option>

                  <option value="dairy">
                    {t.businessCategories.dairy}
                  </option>

                  <option value="farming">
                    {t.businessCategories.farming}
                  </option>

                  <option value="livestock">
                    {t.businessCategories.livestock}
                  </option>

                  <option value="poultry">
                    {t.businessCategories.poultry}
                  </option>

                  <option value="tailoring">
                    {t.businessCategories.tailoring}
                  </option>

                  <option value="handicraft">
                    {t.businessCategories.handicraft}
                  </option>

                  <option value="food">
                    {t.businessCategories.food}
                  </option>

                  <option value="smallShop">
                    {t.businessCategories.smallShop}
                  </option>

                  <option value="beauty">
                    {t.businessCategories.beauty}
                  </option>

                  <option value="other">
                    {t.businessCategories.other}
                  </option>

                </select>

              </div>


              {/* Risk Preference */}
              <div className="recommendation-field">

                <label>
                  {t.riskPreference}
                </label>

                <select
                  name="riskPreference"
                  value={formData.riskPreference}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {t.selectRisk}
                  </option>

                  <option value="low">
                    {t.low}
                  </option>

                  <option value="medium">
                    {t.medium}
                  </option>

                  <option value="high">
                    {t.high}
                  </option>

                </select>

              </div>


              {/* Experience */}
              <div className="recommendation-field">

                <label>
                  {t.experience}
                </label>

                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {t.selectExperience}
                  </option>

                  <option value="beginner">
                    {t.beginner}
                  </option>

                  <option value="1-2_years">
                    {t.oneTwoYears}
                  </option>

                  <option value="3+_years">
                    {t.threePlusYears}
                  </option>

                </select>

              </div>


              {/* Skills */}
              <div className="recommendation-field">

                <label>
                  {t.skills}
                </label>

                <select name="skills" value={formData.skills} onChange={handleChange} required>
                  <option value="">{t.enterSkills}</option>
                  {Object.entries({ cooking: "Cooking", tailoring: "Tailoring", farming: "Farming", animal_husbandry: "Animal husbandry", craft: "Crafts", technical: "Technical work", retail: "Retail", beauty: "Beauty services", machinery: "Machinery" }).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>

              </div>

            </div>
          </div>


          {/* =================================================
              3. TIME, LOCATION & GOALS
              ================================================= */}

          <div className="recommendation-section">

            <h2>
              {t.timeLocationGoals}
            </h2>

            <div className="recommendation-grid">

              {/* Location */}
              <div className="recommendation-field">

                <label>
                  {t.locationVillage}
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={t.enterLocation}
                  required
                />

              </div>


              {/* Available Time */}
              <div className="recommendation-field">

                <label>
                  {t.availableTime}
                </label>

                <input type="number" name="availableTime" value={formData.availableTime}
                  onChange={handleChange} min="1" max="24" step="0.5"
                  placeholder="Hours per day (1–24)" aria-label="Available hours per day" required />

              </div>


              {/* Seasonal Availability */}
              <div className="recommendation-field">

                <label>
                  {t.seasonalAvailability}
                </label>

                <select
                  name="seasonalAvailability"
                  value={formData.seasonalAvailability}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {t.selectSeasonal}
                  </option>

                  <option value="yes">
                    {t.yes}
                  </option>

                  <option value="no">
                    {t.no}
                  </option>

                </select>

              </div>


              {/* Expected Income */}
              <div className="recommendation-field">

                <label>
                  {t.expectedIncomeGoal}
                </label>

                <input
                  type="number"
                  name="incomeGoal"
                  value={formData.incomeGoal}
                  onChange={handleChange}
                  placeholder={t.enterIncomeGoal}
                  min="0"
                  required
                />

              </div>

            </div>
          </div>


          {/* =================================================
              SUBMIT BUTTON
              ================================================= */}

          <div className="recommendation-button-container">
            <button
              type="submit"
              className="recommendation-submit-button"
              disabled={loading}
            >
              {loading
                ? "..."
                : t.submitRecommendation}
            </button>
          </div>
        </form>
      </div>


      {/* =====================================================
          SUGGESTION BOX
          APPEARS ONLY AFTER SUBMIT
          ===================================================== */}

      {error && <p role="alert" className="business-suggestion-box">{error}</p>}
      {suggestion && (
        <div className="business-suggestion-box">
          <div className="suggestion-header">
            <Lightbulb size={28} />

            <h2>
              {t.suggestionTitle}
            </h2>

          </div>

          <div className="suggestion-content">

            {suggestion.length === 0 && <p>{outputTranslations?.empty || "No recommendations found. Try adjusting your profile."}</p>}
            {suggestion.map((item) => (
              <section key={item.business}>
              <h3>{outputTranslations?.businesses[item.business] || item.business}</h3>
              <ul>{(item.reasons || []).map((reason) => <li key={reason}>{outputTranslations?.reasons[reason] || reason}</li>)}</ul>
              </section>
            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default BusinessRecommendations;