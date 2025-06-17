import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { Icon } from "../Icon";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface CircleButtonProps {
  icon: IconProp;
  onPress: () => void;
  onLongPress?: () => void;
  size?: number;
  style?: ViewStyle;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  loading?: boolean;
}

export const CircleButton: React.FC<CircleButtonProps> = ({
  icon,
  onPress,
  onLongPress,
  size = 36,
  style,
  color,
  backgroundColor,
  disabled = false,
  loading = false,
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
          backgroundColor: backgroundColor || colors.accent.primary,
        },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={color || colors.text.primary} />
      ) : (
        <Icon
          icon={icon}
          size={size * 0.5}
          color={color || colors.text.primary}
        />
      )}
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
