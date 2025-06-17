import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StyleProp,
} from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { common } from "@/common/styles";
import { useThemeSpecificStyles } from "@/common/theme/hooks/useThemeSpecificStyles";

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  clearInput?: () => void;
  disabled?: boolean;
  style?: StyleProp<any>;
  inputStyle?: StyleProp<any>;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onLeftIconPress,
  clearInput,
  style,
  disabled = false,
  inputStyle,
  ...props
}) => {
  const { colors, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error.primary;
    if (isFocused) return colors.accent.primary;
    return colors.neutral[300];
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background.primary },
        style,
      ]}
    >
      {label && (
        <Text
          style={[
            typography.labelMedium,
            { color: colors.text.secondary, marginBottom: 4 },
          ]}
        >
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          common.shadow,

          {
            borderColor: getBorderColor(),
            opacity: disabled ? 0.5 : 1,
          },
          inputStyle,
        ]}
      >
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <FontAwesomeIcon
              icon={leftIcon}
              size={15}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        <RNTextInput
          style={[
            styles.input,
            typography.bodyMedium,
            { color: colors.text.primary },
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            disabled && styles.disabledInput,
          ]}
          placeholderTextColor={colors.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled && props.editable !== false}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconContainer}
            disabled={disabled}
          >
            <FontAwesomeIcon
              icon={rightIcon}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        {clearInput && props.value && !disabled && (
          <TouchableOpacity onPress={clearInput} style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={faTimes}
              size={20}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            typography.bodySmall,
            {
              color: error ? colors.error.primary : colors.text.secondary,
              marginTop: 4,
            },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderWidth: 0.2,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    ...common.controls,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    paddingTop: 11,
    display: "flex",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
  },
});
