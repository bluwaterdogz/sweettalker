import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import { useTheme } from "@/theme";

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message }) => {
  const { colors, typography } = useTheme();
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary.main} />
      {message && (
        <Text
          style={[
            typography.bodyMedium,
            styles.message,
            { color: colors.text.secondary },
          ]}
        >
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
    padding: 24,
    backgroundColor: "transparent",
  },
  message: {
    marginTop: 16,
    textAlign: "center",
  },
});
