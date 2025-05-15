import { colors } from "@/theme";
import { View, StyleSheet } from "react-native";
import { ReactNode } from "react";

interface CardContentProps {
  children: ReactNode;
  style?: object;
}

export const CardContent = ({ children, style }: CardContentProps) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background.paper,
  },
});
