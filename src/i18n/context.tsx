import React, { createContext, useContext, useCallback } from "react";
import { i18nConfig } from "./config";
import { Language } from "./types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";

interface I18nContextType {
  language: string;
  setLanguage: (code: string) => Promise<void>;
  languages: Language[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  const setLanguage = useCallback(
    async (code: string) => {
      try {
        await AsyncStorage.setItem("userLanguage", code);
        await i18n.changeLanguage(code);
      } catch (error) {
        console.error("Error saving language preference:", error);
      }
    },
    [i18n]
  );

  return (
    <I18nContext.Provider
      value={{
        language: i18n.language,
        setLanguage,
        languages: i18nConfig.languages,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};
