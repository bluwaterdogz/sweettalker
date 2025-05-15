import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../../theme/context";

interface LoaderProps {
  message?: string;
  size?: "small" | "large";
}

export const Loader: React.FC<LoaderProps> = ({ message, size = "large" }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.primary.main} />
      {message && (
        <Text style={[styles.message, { color: colors.text.secondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginTop: 12,
  },
});
