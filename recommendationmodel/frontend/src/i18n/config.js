import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import hi from "./locales/hi.json";
import mr from "./locales/mr.json";

const supportedLanguages = ["en", "hi", "mr"];
const requestedLanguage = new URLSearchParams(window.location.search).get("lang");
const initialLanguage = supportedLanguages.includes(requestedLanguage)
  ? requestedLanguage
  : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    mr: { translation: mr }
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false
});

export default i18n;
