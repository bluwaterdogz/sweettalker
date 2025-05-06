import React, { createContext, useContext, useEffect } from "react";
import { colors, darkPalette } from "./colors";
import { typography } from "./typography";
import { useServices } from "@/services/provider";
import { isFeatureEnabled } from "@/config/featureFlags";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_STORAGE_KEY = "@sweettalker:theme";

type ThemeContextType = {
  colors: typeof colors;
  typography: typeof typography;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colors,
  typography,
  isDarkMode: false,
  toggleTheme: () => {},
  setDarkMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const { profileService } = useServices();
  const useFirebaseAuth = isFeatureEnabled("USE_FIREBASE_AUTH");

  // Load initial theme
  useEffect(() => {
    const loadTheme = async () => {
      try {
        if (useFirebaseAuth) {
          // Try to load from Firestore first
          const settings = await profileService.getUserSettings();
          if (settings?.theme) {
            setIsDarkMode(settings.theme === "dark");
          } else {
            // Fallback to localStorage
            const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (storedTheme) {
              setIsDarkMode(storedTheme === "dark");
            }
          }
        } else {
          // Use localStorage only
          const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
          if (storedTheme) {
            setIsDarkMode(storedTheme === "dark");
          }
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };

    loadTheme();
  }, []);

  const setDarkMode = async (isDark: boolean) => {
    try {
      setIsDarkMode(isDark);

      // Save to Firestore if using Firebase auth
      if (useFirebaseAuth) {
        await profileService.createOrUpdateUserSettings({
          theme: isDark ? "dark" : "light",
        });
      }

      // Always save to localStorage as fallback
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  const themeColors = isDarkMode ? darkPalette : colors;

  const value = {
    colors: themeColors,
    typography,
    isDarkMode,
    toggleTheme,
    setDarkMode,
  };

  return (
    <ThemeContext.Provider value={value as any}>
      {children}
    </ThemeContext.Provider>
  );
};
