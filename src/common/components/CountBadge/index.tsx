import { useTheme } from "@/common/theme/hooks/useTheme";
import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

interface CountBadgeProps {
  count: ReactNode;
  size?: number;
  color?: string;
}
export const CountBadge = ({ count, size = 48, color }: CountBadgeProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.avatarWrapper,
        {
          left: 40,
          top: 30,
          zIndex: 20,
          position: "absolute",
          width: size * 0.4,
          height: size * 0.4,
          borderRadius: (size * 0.4) / 2,
          backgroundColor: color || colors.accent.secondary,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 2,
          borderColor: "#fff",
        },
      ]}
    >
      <Text style={{ fontWeight: "bold", color: "#444", fontSize: 10 }}>
        {count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarWrapper: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    backgroundColor: "transparent",
  },
});
