import { useTheme } from "../../theme/hooks/useTheme";
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
}: CardProps) => {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background.primary,
          borderColor: colors.neutral[400],
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 24,
  },
});
