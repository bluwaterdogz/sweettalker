import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, Switch } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  faMoon,
  faBell,
  faRobot,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useServices } from "@/services/context";
import { Model } from "@common/types/model";
import { MultiSelect } from "@/common/components/MultiSelect";
import SettingField from "./SettingField";
import { Settings } from "@common/models/profile/settings";
import { mapToOption } from "@common/utils/options";
import { updateSettings } from "../store/thunks";
import { setSettings } from "../store/slice";
import { ContentDropdown, Loader } from "@/common/components";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { ThemeLabel } from "@/common/theme/types";
import { requestNotificationPermissions } from "@/permissions/notifications/requestNotificationPermissions";

export const ProfileSettings = () => {
  const { profileService } = useServices();
  const { colors, theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const modelOptions = useMemo(() => mapToOption(Model), []);
  const { language, languages, setLanguage } = useTranslation();
  const { loading, model, notifications } = useAppSelector(
    (state) => state.settings
  );
  const { t } = useTranslation();

  const languageOptions = useMemo(
    () =>
      languages.map((lang) => ({
        label: lang.nativeName,
        value: lang.code,
      })),
    [languages]
  );

  const handleSettingsChange = useCallback(
    async (newSettings: Partial<Settings>) => {
      try {
        dispatch(updateSettings(newSettings));
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    },
    [profileService]
  );

  const handleModelChange = useCallback(
    async (model: Model[]) => {
      const selectedModel = model[0];
      dispatch(setSettings({ model: selectedModel }));
      await handleSettingsChange({ model: selectedModel });
    },
    [handleSettingsChange]
  );

  const handleNotificationsChange = useCallback(
    async (notifications: boolean) => {
      if (!notifications) {
        await requestNotificationPermissions({
          onReject: () => {
            dispatch(setSettings({ notifications: false }));
          },
          onSuccess: async () => {
            dispatch(setSettings({ notifications }));
            await handleSettingsChange({ notifications });
          },
        });
      }
    },
    [handleSettingsChange]
  );

  const handleLanguageChange = useCallback(
    async (language: string) => {
      setLanguage(language);
      await handleSettingsChange({ language });
    },
    [handleSettingsChange, setLanguage]
  );

  const handleThemeChange = useCallback(
    async (setDarkMode: boolean) => {
      setTheme(setDarkMode ? ThemeLabel.dark : ThemeLabel.light);
      await handleSettingsChange({
        theme: setDarkMode ? ThemeLabel.dark : ThemeLabel.light,
      });
    },
    [handleSettingsChange]
  );

  const trackColors = useMemo(
    () => ({
      false: colors.text.secondary,
      true: colors.accent.primary,
    }),
    [colors]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <SettingField
        icon={faMoon}
        title={t("common.darkMode")}
        children={
          <Switch
            disabled={loading}
            value={theme === ThemeLabel.dark}
            onValueChange={handleThemeChange}
            trackColor={trackColors}
            thumbColor={colors.background.primary}
          />
        }
      />
      <SettingField
        icon={faLanguage}
        title={t("common.language")}
        children={
          <MultiSelect
            disabled={loading}
            options={languageOptions}
            selectedValues={language ? [language] : []}
            onSelectionChange={([selected]) => {
              handleLanguageChange(selected);
            }}
            mode="single"
            placeholder={t("common.selectLanguage")}
          />
        }
      />
      <SettingField
        icon={faBell}
        title={t("common.enableNotifications")}
        children={
          <Switch
            disabled={loading}
            value={notifications}
            onValueChange={handleNotificationsChange}
            trackColor={trackColors}
            thumbColor={colors.background.primary}
          />
        }
      />
      {/* <Button
        title="Check Store State"
        onPress={() => dispatch(checkStoreState())}
      /> */}
      <ContentDropdown label="Advanced" topControl>
        <SettingField
          icon={faRobot}
          title={t("common.model")}
          children={
            <MultiSelect
              disabled={loading}
              options={modelOptions}
              selectedValues={model ? [model] : []}
              onSelectionChange={handleModelChange}
              mode="single"
            />
          }
        />
      </ContentDropdown>
      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    overflow: "scroll",
  },
});
