import { useTheme } from "@/common/theme/hooks/useTheme";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, ViewStyle } from "react-native";

interface AnimatedProgressBarProps {
  value: number; // 0 to 1
  color: string;
  label?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  height?: number;
  labelStyle?: any;
}

export const AnimatedProgressBar: React.FC<AnimatedProgressBarProps> = ({
  value,
  color,
  label,
  style,
  backgroundColor = "#F2F2F2",
  height = 38,
  labelStyle,
}) => {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={[styles.container, { backgroundColor, height }, style]}>
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: color,
            width: widthInterpolate,
            height: "100%",
          },
        ]}
      >
        {label && (
          <Text
            style={[styles.label, { color: colors.text.primary }, labelStyle]}
            numberOfLines={1}
          >
            {label}
          </Text>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
  },
  bar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: "600",
    fontSize: 18,
  },
});

export default AnimatedProgressBar;
