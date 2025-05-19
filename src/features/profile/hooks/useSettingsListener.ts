import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Settings } from "../api";
import { useServices } from "@/services/context";
import { useI18n } from "@/i18n/context";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { setSettings } from "../store/slice";

export const useSettingsListener = () => {
  // const { language: settingsLanguage } = useAppSelector(
  //   (state) => state.settings
  // );
  const { language: i18nLanguage, setLanguage } = useI18n();
  const { profileService } = useServices();
  const { theme: themeState, setTheme } = useTheme();
  const [languageCommitted, setLanguageCommitted] = useState(false);
  const dispatch = useAppDispatch();

  useSubscribeFirestore<Settings>(profileService.subscribeSingle, {
    onData: (settings) => {
      const { language, theme, model, notifications } = settings;
      if (theme && theme !== themeState) {
        setTheme(theme);
      }

      // if (language && language !== i18nLanguage) {
      // setTimeout(() => {
      //   setLanguage(language as any);
      // }, 1000);
      // }
      dispatch(
        setSettings({
          model,
          notifications,
        })
      );
    },
  });

  // useEffect(() => {
  //   if (
  //     settingsLanguage &&
  //     settingsLanguage !== i18nLanguage &&
  //     !languageCommitted
  //   ) {
  //     // Only run once Redux has already rendered with settings.language
  //     requestAnimationFrame(() => {
  //       console.log("🌍 Applying i18n language:", settingsLanguage);
  //       setLanguage(settingsLanguage);
  //       setLanguageCommitted(true);
  //     });
  //   }
  // }, [settingsLanguage, i18nLanguage, languageCommitted]);

  return { loading: false };
};
