export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Translation {
  [key: string]: string | Translation;
}

export interface I18nConfig {
  defaultLanguage: string;
  fallbackLanguage: string;
  languages: Language[];
  translations: {
    [key: string]: Translation;
  };
}
