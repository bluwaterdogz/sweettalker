import { I18n } from "i18n-js";
import { getLocales } from "expo-localization";
import { Language } from "./types";

import translations from "./translations/translations";
// Create i18n instance
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app
i18n.locale = getLocales()[0].languageCode || "en";

// When a value is missing from a language it'll fallback to another language with the key present
i18n.enableFallback = true;
i18n.defaultLocale = "en";

// Optional: Configure i18n-js
// i18n.missingTranslation = (key: string) => {
//   console.warn(`Missing translation for key: ${key}`);
//   return key;
// };

// Helper function to get available languages
export const getAvailableLanguages = (): Language[] => {
  return Object.keys(i18n.translations).map((code) => ({
    code,
    name: i18n.translations[code].languageName || code,
    nativeName: i18n.translations[code].languageNativeName || code,
  }));
};

// Helper function to set language
export const setLanguage = (languageCode: string) => {
  i18n.locale = languageCode;
};

// Helper function to get current language
export const getCurrentLanguage = (): string => {
  return i18n.locale;
};

export default i18n;
