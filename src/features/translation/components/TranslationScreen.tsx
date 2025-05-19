import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { TranslationList } from "./TranslationList";
import { TranslationControls } from "./TranslationControls";
import { ErrorBoundary } from "@/common/components/ErrorBoundary";
import { Drawer, Tabs } from "@/common/components";
import { TranslationFilters } from "./TranslationFilters";
export const TranslationScreen = () => {
  const { colors } = useTheme();

  const tabs = useMemo(
    () => [
      {
        id: "translations",
        label: "Translations",
        content: <TranslationFilters />,
      },
    ],
    [colors]
  );

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <View style={styles.content}>
        <ErrorBoundary>
          <TranslationControls />
        </ErrorBoundary>
        <ErrorBoundary>
          <TranslationList />
        </ErrorBoundary>
      </View>
      <ErrorBoundary>
        <Drawer showHandle={true}>
          <Tabs tabs={tabs} />
        </Drawer>
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    display: "flex",
    flex: 1,
  },
});
