import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { useTheme } from "../../../theme/context";

interface ErrorMessageProps {
  message?: string;
  error?: Error | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  error,
}) => {
  const { colors, typography } = useTheme();

  if (!message && !error) return null;

  return (
    <View style={styles.container}>
      <Text
        style={[
          typography.bodyMedium,
          { color: colors.error.main },
          styles.message,
        ]}
      >
        {message || error?.message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  message: {
    textAlign: "center",
  },
});
