import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { useTheme } from "../../../theme/context";
import { Icon } from "@/components/common";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface CircleButtonProps {
  icon: IconProp;
  onPress: () => void;
  size?: number;
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  icon,
  onPress,
  size = 48,
  style,
  color,
  backgroundColor,
  disabled = false,
}) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: backgroundColor || colors.primary.main,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Icon icon={icon} size={size * 0.5} color={color || colors.text.light} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
