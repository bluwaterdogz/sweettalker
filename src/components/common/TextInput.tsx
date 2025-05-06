import React from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { useTheme } from "@/theme";

type TextInputVariant = "default" | "multiline";

interface CommonTextInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
  secureTextEntry?: boolean;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad";
  variant?: TextInputVariant;
}

export const TextInput: React.FC<CommonTextInputProps> = (props) => {
  const {
    value,
    onChangeText,
    placeholder,
    multiline = false,
    style,
    secureTextEntry = false,
    autoCapitalize = "none",
    keyboardType = "default",
    variant = "default",
    ...rest
  } = props;
  const { colors, typography } = useTheme();

  return (
    <RNTextInput
      style={[
        styles.input,
        variant === "multiline" || multiline
          ? styles.inputMultiline
          : styles.inputDefault,
        typography.bodyMedium,
        { color: colors.text.primary, borderColor: colors.neutral[300] },
        style,
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.text.secondary}
      multiline={multiline}
      secureTextEntry={secureTextEntry}
      autoCapitalize={autoCapitalize}
      keyboardType={keyboardType}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 8,
  },
  inputDefault: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    minHeight: 40,
  },
  inputMultiline: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 48,
  },
});
