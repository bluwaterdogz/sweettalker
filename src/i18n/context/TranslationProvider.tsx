import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useMemo,
  useCallback,
} from "react";
import i18n, {
  getAvailableLanguages,
  setLanguage,
  getCurrentLanguage,
} from "..";

interface TranslationContextType {
  t: (key: string, params?: Record<string, string | number>) => string;
  setLanguage: (languageCode: string) => void;
  language: string;
  languages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
}

export const TranslationContext = createContext<
  TranslationContextType | undefined
>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const [language, setCurrentLanguage] = useState(getCurrentLanguage());

  const setLanguageLocal = useCallback(
    (languageCode: string) => {
      if (languageCode !== getCurrentLanguage()) {
        setLanguage(languageCode);
        setCurrentLanguage(languageCode);
      }
    },
    [setCurrentLanguage, setLanguage]
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return i18n.t(key, params);
    },
    []
  );

  const value = useMemo(() => {
    return {
      t,
      setLanguage: setLanguageLocal,
      language,
      languages: getAvailableLanguages(),
    };
  }, [t, setLanguageLocal, language]);

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationContext = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error(
      "useTranslationContext must be used within a TranslationProvider"
    );
  }
  return context;
};
