import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
  Text,
  StyleProp,
} from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { common } from "@/common/styles";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  title?: string;
  icon?: IconDefinition;
  style?: StyleProp<any>;
  buttonTextStyles?: StyleProp<any>;
  flex?: number;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  style,
  variant = "outline",
  size = "medium",
  loading = false,
  fullWidth = false,
  disabled,
  title,
  icon,
  flex,
  buttonTextStyles,
  ...props
}) => {
  const { colors, typography } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.neutral[200];
    switch (variant) {
      case "primary":
        return colors.accent.primary;
      case "secondary":
        return colors.accent.secondary;
      case "outline":
        return colors.background.primary;
      default:
        return colors.background.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.neutral[400];
    switch (variant) {
      case "primary":
      case "secondary":
        return colors.text.primary;
      case "outline":
        return colors.text.primary;
      default:
        return colors.text.primary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.neutral[300];
    switch (variant) {
      case "outline":
        return colors.neutral[300];
      default:
        return "transparent";
    }
  };

  const getPadding = () => {
    switch (size) {
      case "small":
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case "large":
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case "small":
        return typography.bodySmall;
      case "large":
        return typography.bodyLarge;
      default:
        return typography.bodyMedium;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        common.shadow,

        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          ...getPadding(),
          width: fullWidth ? "100%" : "auto",
          flex: flex,
        },
        style,
      ]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              size={16}
              color={getTextColor()}
              style={[styles.icon, buttonTextStyles]}
            />
          )}
          {title ? (
            <Text
              style={[
                getFontSize(),
                {
                  color: getTextColor(),
                  textAlign: "center",
                },
                buttonTextStyles,
              ]}
            >
              {title}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
    ...common.controls,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 8,
  },
});
