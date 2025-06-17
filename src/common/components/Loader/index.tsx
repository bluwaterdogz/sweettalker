import React from "react";
import { ActivityIndicator, StyleSheet, View, Text } from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";

interface LoaderProps {
  message?: string;
  size?: "small" | "large";
  loading?: boolean;
  children?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({
  message,
  size = "large",
  loading = true,
  children,
}) => {
  const { colors } = useTheme();

  if (!loading) {
    return children;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={colors.accent.primary} />
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
