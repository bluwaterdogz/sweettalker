import React, { ReactNode, useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useTheme } from "@/theme";

interface ToastProps {
  message: ReactNode;
  title?: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  title,
  type = "info",
  duration = 3000,
  onClose,
}) => {
  const { colors, typography } = useTheme();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  }, []);

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return colors.success.main;
      case "error":
        return colors.error.main;
      case "info":
      default:
        return colors.primary.main;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          backgroundColor: getBackgroundColor(),
        },
      ]}
    >
      {title && (
        <Text
          style={[
            typography.titleSmall,
            styles.title,
            { color: colors.text.light },
          ]}
        >
          {title}
        </Text>
      )}
      <Text
        style={[
          typography.bodyMedium,
          styles.text,
          { color: colors.text.light },
        ]}
      >
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 32,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  title: {
    marginBottom: 4,
    fontWeight: "600",
  },
  text: {
    textAlign: "center",
  },
});
