import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/theme";

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: object;
}

export const Card: React.FC<CardProps> = ({ children, onPress, style }) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: colors.background.paper,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
});
