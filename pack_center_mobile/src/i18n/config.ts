import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import zsTranslation from "./locales/zh/translation.json";

export const supportedLang = ["en", "zh"] as const;

export type Language = (typeof supportedLang)[number];

i18next.use(initReactI18next).init({
  lng: "en", // if you're using a language detector, do not define the lng option
  fallbackLng: "en",
  supportedLngs: supportedLang,
  compatibilityJSON: "v3",
  resources: {
    en: {
      translation: enTranslation,
    },
    zh: {
      translation: zsTranslation,
    },
  },
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export { i18next };
