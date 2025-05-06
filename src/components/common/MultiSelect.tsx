import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { useTheme } from "@/theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronDown, faCheck } from "@fortawesome/free-solid-svg-icons";

interface MultiSelectProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  style?: any;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options",
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { colors, typography } = useTheme();

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter((v) => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) return placeholder;

    const selectedLabels = options
      .filter((opt) => selectedValues.includes(opt.value))
      .map((opt) => opt.label);

    if (selectedLabels.length === options.length) {
      return "All modalities";
    }

    if (selectedLabels.length === 0) {
      return placeholder;
    }

    if (selectedLabels.length === 1) {
      return selectedLabels[0];
    }

    return `${selectedLabels[0]} +${selectedLabels.length - 1} more`;
  };

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={[
          styles.header,
          {
            borderColor: colors.neutral[300],
            backgroundColor: colors.background.default,
          },
        ]}
        onPress={toggleDropdown}
      >
        <Text
          style={[
            typography.bodyMedium,
            styles.placeholder,
            { color: colors.text.primary },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {getDisplayText()}
        </Text>
        <FontAwesomeIcon
          icon={faChevronDown}
          color={colors.text.primary}
          size={16}
          style={[styles.icon, isOpen && { transform: [{ rotate: "180deg" }] }]}
        />
      </Pressable>

      {isOpen && (
        <View
          style={[
            styles.dropdown,
            {
              borderColor: colors.neutral[300],
              backgroundColor: colors.background.default,
            },
          ]}
        >
          <ScrollView style={styles.scrollView}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.option,
                  {
                    backgroundColor: selectedValues.includes(option.value)
                      ? colors.primary.light
                      : "transparent",
                  },
                ]}
                onPress={() => toggleOption(option.value)}
              >
                <Text
                  style={[
                    typography.bodyMedium,
                    { color: colors.text.primary },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {option.label}
                </Text>
                {selectedValues.includes(option.value) && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={colors.primary.main}
                    size={16}
                  />
                )}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  placeholder: {
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginLeft: 8,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: 4,
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    zIndex: 1000,
  },
  scrollView: {
    maxHeight: 200,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
});
