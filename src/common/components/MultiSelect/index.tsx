import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  StyleProp,
} from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Portal } from "react-native-portalize";
import { common } from "@/common/styles";
import { isEqual } from "lodash";

interface Option<T> {
  label: string;
  value: T;
}

interface MultiSelectProps<T> {
  options: Option<T>[];
  selectedValues: T[];
  onSelectionChange: (selected: T[]) => void;
  label?: string;
  placeholder?: string;
  mode?: "single" | "multi";
  disabled?: boolean;
  style?: StyleProp<any>;
  dropdownStyle?: StyleProp<any>;
}

export function MultiSelect<T = string>({
  options,
  selectedValues,
  onSelectionChange,
  label,
  placeholder,
  mode = "multi",
  disabled = false,
  dropdownStyle,
  style,
}: MultiSelectProps<T>): React.ReactNode {
  const { colors, typography } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [dropdownLeft, setDropdownLeft] = useState(0);
  const [dropdownWidth, setDropdownWidth] = useState(0);
  const triggerRef = useRef<View>(null);

  const windowHeight = Dimensions.get("window").height;

  const isSelected = (value: T): boolean => {
    if (typeof value === "string") {
      return selectedValues.includes(value);
    }
    return selectedValues.some((selected) => isEqual(selected, value));
  };

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      triggerRef.current.measureInWindow((x, y, width, height) => {
        setDropdownTop(y + height);
        setDropdownLeft(x);
        setDropdownWidth(width);
      });
    }
  }, [isOpen]);

  const toggleOption = (value: T) => {
    if (disabled) return;
    if (mode === "single") {
      onSelectionChange(isSelected(value) ? [] : [value]);
      setIsOpen(false);
    } else {
      onSelectionChange(
        isSelected(value)
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value]
      );
    }
  };

  const getSelectedLabels = () => {
    if (selectedValues.length === 0) return placeholder || "Select options";
    if (mode === "single") {
      const selected = options.find((opt) => opt.value === selectedValues[0]);
      return selected?.label || placeholder || "Select an option";
    }
    if (selectedValues.length === 1) {
      const selected = options.find((opt) => opt.value === selectedValues[0]);
      return selected?.label || placeholder || "Select options";
    }
    return `${selectedValues.length} options selected`;
  };

  const maxDropdownHeight = Math.max(100, windowHeight - dropdownTop - 16);

  return (
    <View style={{ flex: 1 }}>
      {label && (
        <Text style={[typography.labelMedium, { marginBottom: 8 }]}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        ref={triggerRef}
        style={[
          styles.trigger,
          common.shadow,
          {
            backgroundColor: colors.background.primary,
            borderColor: colors.neutral[200],
          },
          disabled && styles.disabledTrigger,
          style,
        ]}
        onPress={() => setIsOpen(!isOpen)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text
          style={[
            typography.bodyMedium,
            {
              color:
                selectedValues.length > 0
                  ? colors.text.primary
                  : colors.text.primary,
              opacity: disabled ? 0.5 : 1,
            },
          ]}
        >
          {getSelectedLabels()}
        </Text>
        <FontAwesomeIcon
          icon={faChevronDown}
          size={16}
          color={colors.text.secondary}
          style={[
            styles.chevron,
            isOpen && styles.chevronRotated,
            disabled && { opacity: 0.5 },
          ]}
        />
      </TouchableOpacity>

      {isOpen && (
        <Portal>
          <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
            <View style={StyleSheet.absoluteFillObject}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.dropdown,
                    {
                      backgroundColor: colors.background.primary,
                      borderColor: colors.neutral[200],

                      position: "absolute",
                      zIndex: 9999,
                      top: dropdownTop,
                      left: dropdownLeft,
                      width: dropdownWidth,
                      maxHeight: maxDropdownHeight,
                    },
                    dropdownStyle,
                  ]}
                >
                  {options.map((item) => {
                    const selected = isSelected(item.value);
                    return (
                      <TouchableOpacity
                        key={item.label}
                        style={[
                          styles.option,
                          {
                            backgroundColor: selected
                              ? colors.accent.secondary
                              : colors.background.primary,
                            borderColor: selected
                              ? colors.accent.primary
                              : colors.neutral[200],
                            opacity: disabled ? 0.5 : 1,
                          },
                        ]}
                        onPress={() => !disabled && toggleOption(item.value)}
                        disabled={disabled}
                      >
                        <Text
                          style={[
                            typography.bodyMedium,
                            { color: colors.text.primary },
                          ]}
                        >
                          {" "}
                          {item.label}{" "}
                        </Text>
                        {selected && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            size={18}
                            color={colors.accent.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  disabledTrigger: {
    opacity: 0.5,
  },
  chevron: {
    transform: [{ rotate: "0deg" }],
  },
  chevronRotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdown: {
    borderWidth: 0.5,
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
  },
});
