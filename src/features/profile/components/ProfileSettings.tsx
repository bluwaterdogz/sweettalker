import React, { useCallback, useEffect, useMemo } from "react";
import { View, StyleSheet, Switch, Text } from "react-native";
import { useTheme } from "@/theme";
import { useAppDispatch } from "@/store";
import { logout } from "@/features/firebase-auth/reducers";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMoon, faBell, faRobot } from "@fortawesome/free-solid-svg-icons";
import { useServices } from "@/services/context";
import { Picker } from "@react-native-picker/picker";
import { mapToOption } from "@/lib/utils";
import { Colors } from "@/theme/colors";
import { Model } from "@/features/common-interpretation/api/enums";

export const ProfileSettings = () => {
  const { colors, typography, isDarkMode, setDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { profileService } = useServices();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [selectedModel, setSelectedModel] = React.useState("gpt-4");

  const modelOptions = useMemo(() => mapToOption(Model), []);
  const styles = getStyles(colors);

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await profileService.getUserSettings();
        if (settings) {
          setNotificationsEnabled(settings.notificationsEnabled);
          if (settings.defaultModel) {
            setSelectedModel(settings.defaultModel);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };

    loadSettings();
  }, []);

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
  }, [dispatch]);

  const handleModelChange = useCallback(
    async (model: string) => {
      setSelectedModel(model);

      try {
        await profileService.createOrUpdateUserSettings({
          defaultModel: model,
        });
      } catch (error) {
        console.error("Error saving model preference:", error);
      }
    },
    [profileService]
  );

  const handleNotificationsChange = useCallback(
    async (enabled: boolean) => {
      setNotificationsEnabled(enabled);

      try {
        await profileService.createOrUpdateUserSettings({
          notificationsEnabled: enabled,
        });
      } catch (error) {
        console.error("Error saving notification preference:", error);
      }
    },
    [profileService]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <FontAwesomeIcon
              icon={faMoon}
              color={colors.primary.main}
              size={12}
              style={styles.icon}
            />
            <Text
              style={[typography.bodyMedium, { color: colors.text.primary }]}
            >
              Dark Mode
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setDarkMode}
            trackColor={{
              false: colors.text.secondary,
              true: colors.primary.main,
            }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <FontAwesomeIcon
              icon={faRobot}
              color={colors.primary.main}
              size={20}
              style={styles.icon}
            />
            <Text
              style={[typography.bodyMedium, { color: colors.text.primary }]}
            >
              Default Model
            </Text>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedModel}
              onValueChange={handleModelChange}
              style={[
                styles.picker,
                {
                  color: colors.text.primary,
                  backgroundColor: colors.background.paper,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.neutral[200],
                },
              ]}
              dropdownIconColor={colors.text.primary}
              itemStyle={{
                color: colors.text.primary,
                backgroundColor: colors.background.paper,
              }}
            >
              {modelOptions.map(({ label, value }) => (
                <Picker.Item
                  key={value}
                  label={label}
                  value={value}
                  color={colors.text.primary}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.settingItem}>
          <View style={styles.settingContent}>
            <FontAwesomeIcon
              icon={faBell}
              color={colors.primary.main}
              size={20}
              style={styles.icon}
            />
            <Text
              style={[typography.bodyMedium, { color: colors.text.primary }]}
            >
              Enable Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationsChange}
            trackColor={{
              false: colors.text.secondary,
              true: colors.primary.main,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      // display: "flex",
      // padding: 16,
      overflow: "scroll",
    },
    section: {
      marginBottom: 24,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",

      backgroundColor: "transparent",
      borderRadius: 8,
      marginTop: 8,
    },
    settingContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 12,
    },
    logoutButton: {
      marginTop: 15,
    },
    pickerContainer: {
      flex: 1,
      marginLeft: 16,
    },
    picker: {
      // height: 40,
      minWidth: 120,
      overflow: "hidden",
    },
  });
