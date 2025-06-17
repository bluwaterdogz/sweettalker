import { useTheme } from "@/common/theme/hooks/useTheme";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from "react-native";

import { Icon } from "@/common/components";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";

export interface PillProps<V> {
  label: string;
  value: V;
  isSelected?: boolean;
  color?: string;
  showX?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  onClick?: (value: V) => void;
}

export function Pill<V = string>(props: PillProps<V>) {
  const {
    label,
    color = "pink",
    onClick,
    disabled,
    showX = true,
    style,
    labelStyle,
    value,
    isSelected,
  } = props;
  const { colors } = useTheme();

  const backgroundColor = isSelected
    ? color || colors.text.primary
    : colors.background.primary;

  const textColor = isSelected
    ? colors.background.primary
    : colors.text.primary;

  const borderStyles = useThemeBorders();

  return (
    <TouchableOpacity
      style={[
        styles.pill,
        { backgroundColor },
        borderStyles,
        style,
        (disabled || disabled) && styles.disabled,
      ]}
      onPress={() => onClick?.(value)}
      disabled={disabled || disabled}
    >
      <Text
        style={[
          styles.label,
          { color: textColor },
          labelStyle,
          labelStyle,
          (disabled || disabled) && styles.disabledText,
        ]}
      >
        {label}
      </Text>
      {isSelected && showX && (
        <Icon
          style={styles.xIcon}
          icon={faXmark}
          size={14}
          color={colors.text.tertiary}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "transparent",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  xIcon: {},
});
