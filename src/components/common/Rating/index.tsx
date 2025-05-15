import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleEmpty } from "@fortawesome/free-regular-svg-icons";
import { useTheme } from "@/theme";

interface RatingProps {
  value: number;
  maxValue?: number;
  onValueChange?: (value: number) => void;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  value,
  maxValue = 10,
  onValueChange,
  onChange,
  size = 15,
  readonly = false,
}) => {
  const { colors } = useTheme();

  const handlePress = (newValue: number) => {
    if (!readonly && (onValueChange || onChange)) {
      onValueChange?.(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: maxValue }).map((_, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handlePress(index + 1)}
          disabled={readonly}
        >
          <FontAwesomeIcon
            icon={index < value ? faCircle : faCircleEmpty}
            size={size}
            color={colors.primary.main}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
});
