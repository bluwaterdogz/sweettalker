import React from "react";
import { View, StyleSheet } from "react-native";
import { TranslationDrawer } from "./TranslationDrawer";
import { useTheme } from "@/theme";
import { TranslationList } from "./TranslationList";
import { Colors } from "@/theme/colors";
import { TranslationControls } from "./TranslationControls";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export const TranslationScreen = () => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <View style={styles.container}>
      <ErrorBoundary>
        <TranslationControls />
        <TranslationList />
        <TranslationDrawer />
      </ErrorBoundary>
    </View>
  );
};

const getStyles = (colors: Colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.background.default,
    },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
      backgroundColor: colors.background.default,
    },
    content: {
      flex: 1,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
    },
  });
