import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { ReframingControls } from "./ReframingControls";
import { ReframingList } from "./ReframingList";
import { ErrorBoundary } from "@/common/components/ErrorBoundary";

export const ReframingScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ErrorBoundary>
        <ReframingControls />
      </ErrorBoundary>
      <ErrorBoundary>
        <ReframingList />
      </ErrorBoundary>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
