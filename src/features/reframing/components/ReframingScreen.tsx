import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/theme";
import { ReframingControls } from "./ReframingControls";
import { ReframingList } from "./ReframingList";

export const ReframingScreen: React.FC = () => {
  const { colors } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <ReframingControls />
      <ReframingList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
