import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { i18nConfig } from "./config";

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: Object.entries(i18nConfig.translations).reduce(
    (acc, [lang, translations]) => ({
      ...acc,
      [lang]: {
        translation: translations,
      },
    }),
    {}
  ),
  lng: i18nConfig.defaultLanguage,
  fallbackLng: i18nConfig.fallbackLanguage,
  interpolation: {
    escapeValue: false,
  },
  defaultNS: "translation",
  ns: ["translation"],
});

export default i18n;
