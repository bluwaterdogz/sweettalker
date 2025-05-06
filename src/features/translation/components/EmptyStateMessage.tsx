import React, { useRef, useEffect, useState } from "react";
import { Animated, TextStyle } from "react-native";
import { View } from "react-native";
import { useTheme } from "@/theme";

interface EmptyStateMessageProps {
  phrases?: string[];
  style?: TextStyle;
  color?: string;
  typography?: any;
}

const DEFAULT_PHRASES = [
  "Mindful Pause",
  "Drop into the body",
  "Notice your breath",
  "Feel the present moment",
];

export const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({
  phrases = DEFAULT_PHRASES,
  style,
  color,
  typography,
}) => {
  const { colors, typography: themeTypography } = useTheme();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [fadeAnim, phrases.length]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Animated.Text
        style={[
          typography?.headingMedium || themeTypography.headingMedium,
          style,
          { color: color || colors.text.secondary, opacity: fadeAnim },
        ]}
      >
        {phrases[phraseIndex]}
      </Animated.Text>
    </View>
  );
};
