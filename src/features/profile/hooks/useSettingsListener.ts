import { useAppDispatch } from "@/store";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { useServices } from "@/services/context";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { setSettings } from "../store/slice";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useUser } from "@/features/auth/hooks/useUser";
import { Settings } from "@common/models/profile/settings";
import { ThemeLabel } from "@/common/theme/types";

export const useSettingsListener = () => {
  const { language: i18nLanguage, setLanguage } = useTranslation();
  const { profileService } = useServices();
  const { theme: themeState, setTheme } = useTheme();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  useSubscribeFirestore<Settings>(
    (onData, onError) =>
      profileService.subscribeSingle(onData, onError as any, user!.uid!),
    {
      enabled: !!user?.uid,
      onData: (settings: Settings) => {
        const {
          language,
          theme,
          createdAt,
          createdBy,
          updatedAt,
          updatedBy,
          ...rest
        } = settings;
        if (theme && theme !== themeState) {
          setTheme(theme as ThemeLabel);
        }
        if (language && language !== i18nLanguage) {
          setLanguage(language);
        }
        dispatch(setSettings(rest));
      },
    }
  );

  return { loading: false };
};
