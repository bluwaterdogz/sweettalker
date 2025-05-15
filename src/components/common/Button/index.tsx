import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
  ViewStyle,
  Text,
  StyleProp,
} from "react-native";
import { useTheme } from "../../../theme/context";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  fullWidth?: boolean;
  title?: string;
  icon?: IconDefinition;
  style?: StyleProp<any>;
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
  ...props
}) => {
  const { colors, typography } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.neutral[300];
    switch (variant) {
      case "primary":
        return colors.primary.main;
      case "secondary":
        return colors.secondary.main;
      case "outline":
        return "transparent";
      default:
        return colors.primary.main;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.secondary;
    switch (variant) {
      case "primary":
      case "secondary":
        return colors.text.light;
      case "outline":
        return colors.primary.main;
      default:
        return colors.text.light;
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.neutral[300];
    switch (variant) {
      case "outline":
        return colors.primary.main;
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
              style={styles.icon}
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
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
