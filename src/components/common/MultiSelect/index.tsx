import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../../theme/context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selectedValues: string[];
  onSelectionChange: (selected: string[]) => void;
  style?: ViewStyle;
  label?: string;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  style,
  label,
  placeholder,
}) => {
  const { colors, typography } = useTheme();

  const toggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter((v) => v !== value));
    } else {
      onSelectionChange([...selectedValues, value]);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[typography.labelMedium, { marginBottom: 8 }]}>
          {label}
        </Text>
      )}
      <FlatList
        data={options}
        keyExtractor={(item) => item.value}
        renderItem={({ item }) => {
          const isSelected = selectedValues.includes(item.value);
          return (
            <TouchableOpacity
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.primary.light
                    : colors.background.paper,
                  borderColor: isSelected
                    ? colors.primary.main
                    : colors.neutral[200],
                },
              ]}
              onPress={() => toggleOption(item.value)}
            >
              <Text
                style={[typography.bodyMedium, { color: colors.text.primary }]}
              >
                {item.label}
              </Text>
              {isSelected && (
                <FontAwesomeIcon
                  icon={faCheck}
                  size={18}
                  color={colors.primary.main}
                />
              )}
            </TouchableOpacity>
          );
        }}
        style={styles.list}
        ListEmptyComponent={
          <Text
            style={[typography.bodyMedium, { color: colors.text.secondary }]}
          >
            {placeholder || "No options available"}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  list: {
    width: "100%",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
});
