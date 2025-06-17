import { useTheme } from "@/common/theme/hooks/useTheme";
import { ReactNode } from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface CountBadgeProps {
  count: ReactNode;
  size?: number;
  color?: string;
  style?: ViewStyle;
  top?: number;
  left?: number;
}
export const CountBadge = ({
  count,
  size = 48,
  top = 30,
  left = 40,
  color,
  style,
}: CountBadgeProps) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.avatarWrapper,
        {
          left,
          top,
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
      <Text
        style={{
          fontWeight: "bold",
          color: colors.background.primary,
          fontSize: 10,
        }}
      >
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
