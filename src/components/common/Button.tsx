import React from "react";
import {
  StyleSheet,
  Text,
  Pressable,
  Animated,
  View,
  PressableProps,
} from "react-native";
import { useTheme } from "@/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { icon, IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ButtonProps extends PressableProps {
  title?: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: any;
  textStyle?: any;
  children?: React.ReactNode;
  icon?: IconDefinition;
  iconSize?: number;
  iconColor?: string;
  flex?: number;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  children,
  icon,
  iconSize = 16,
  iconColor,
  flex,
  ...rest
}) => {
  const { colors, typography } = useTheme();
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const isPrimary = variant === "primary";
  const buttonStyle = isPrimary ? styles.primaryButton : styles.secondaryButton;
  const textColor = isPrimary ? colors.text.light : colors.primary.main;
  const iconColorValue = iconColor || textColor;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ flex }, style]}
      {...rest}
    >
      <Animated.View
        style={[
          styles.button,
          buttonStyle,
          {
            transform: [{ scale: scaleAnim }],
            backgroundColor: isPrimary ? colors.primary.main : "white",
            borderColor: colors.primary.light,
          },
          styles.shadow,
        ]}
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            color={iconColorValue}
            size={iconSize}
            style={styles.icon}
          />
        )}
        {children || (
          <Text
            style={[
              styles.buttonText,
              typography.bodyMedium,
              { color: textColor },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    minWidth: 0,
  },
  primaryButton: {
    borderWidth: 0,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
