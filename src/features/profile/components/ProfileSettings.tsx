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
import { mapToOption } from "@/common/utils";
import { Model } from "@/features/common/api/enums";
import { MultiSelect } from "@/common/components/MultiSelect";
import { ThemeLabel } from "@/common/theme/types";
import SettingField from "./SettingField";
import { Settings } from "../api";
import { updateSettings } from "../store/thunks";
import { useI18n } from "@/i18n/context";
import { Loader } from "@/common/components";
import { useTranslation } from "react-i18next";
import { Button } from "@/common/components/Button";
import { checkStoreState } from "../store/slice";
export const ProfileSettings = () => {
  const { profileService } = useServices();
  const { colors, theme, setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const modelOptions = useMemo(() => mapToOption(Model), []);
  const { language, languages, setLanguage } = useI18n();
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
        dispatch(
          updateSettings({
            settings: newSettings,
          })
        );
      } catch (error) {
        console.error("Error saving settings:", error);
      }
    },
    [profileService]
  );

  const handleModelChange = useCallback(
    async (model: Model[]) => {
      const selectedModel = model[0];
      await handleSettingsChange({ model: selectedModel });
    },
    [handleSettingsChange]
  );

  const handleNotificationsChange = useCallback(
    async (notifications: boolean) => {
      await handleSettingsChange({ notifications });
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
          />
        }
      />

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

      <SettingField
        icon={faLanguage}
        title={t("common.language")}
        children={
          <MultiSelect
            disabled={loading}
            options={languageOptions}
            selectedValues={language ? [language] : []}
            onSelectionChange={([selected]) => {
              if (selected) {
                handleLanguageChange(selected);
              }
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
          />
        }
      />
      {/* <Button
        title="Check Store State"
        onPress={() => dispatch(checkStoreState())}
      /> */}
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
