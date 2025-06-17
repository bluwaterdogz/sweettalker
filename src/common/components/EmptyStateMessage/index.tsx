import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Text } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface EmptyStateMessageProps {
  messages?: string[];
  interval?: number;
}

export const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  messages = ["Mindful Pause", "Ease into the moment.", "Breath"],
  interval = 3000,
}) => {
  const { colors, typography } = useTheme();
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);

  useEffect(() => {
    const fadeOut = () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        requestAnimationFrame(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
          fadeIn();
        });
      });
    };

    const fadeIn = () => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };

    const timer = setInterval(fadeOut, interval);

    return () => {
      clearInterval(timer);
    };
  }, [fadeAnim, interval, messages.length]);

  return (
    <View style={[styles.container]}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text
          style={[
            typography.titleLarge,
            { color: colors.text.secondary, textAlign: "center" },
          ]}
        >
          {messages[currentIndex]}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 12,
    margin: 16,
    minHeight: 120,
  },
});
