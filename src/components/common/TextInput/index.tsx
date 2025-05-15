import React, { useState } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { useTheme } from "../../../theme/context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  onRightIconPress?: () => void;
  onLeftIconPress?: () => void;
  clearInput?: () => void;
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
  ...props
}) => {
  const { colors, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return colors.error.main;
    if (isFocused) return colors.primary.main;
    return colors.neutral[300];
  };

  return (
    <View style={styles.container}>
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
          {
            borderColor: getBorderColor(),
          },
        ]}
      >
        {leftIcon && (
          <TouchableOpacity
            onPress={onLeftIconPress}
            style={styles.iconContainer}
          >
            <FontAwesomeIcon
              icon={leftIcon}
              size={20}
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
          ]}
          placeholderTextColor={colors.text.secondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconContainer}
          >
            <FontAwesomeIcon
              icon={rightIcon}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        {clearInput && props.value && (
          <TouchableOpacity onPress={clearInput} style={styles.iconContainer}>
            <FontAwesomeIcon
              icon={faTimes}
              size={20}
              color={colors.primary.main}
            />
          </TouchableOpacity>
        )}
      </View>
      {(error || helperText) && (
        <Text
          style={[
            typography.bodySmall,
            {
              color: error ? colors.error.main : colors.text.secondary,
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
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: 40,
    paddingVertical: 8,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    padding: 4,
  },
});
