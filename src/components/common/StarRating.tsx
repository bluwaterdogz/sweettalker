import React from "react";
import { View, Pressable, StyleSheet } from "react-native";

interface StarRatingProps {
  value: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: number;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  value,
  max = 10,
  onChange,
  size = 24,
  disabled = false,
}) => {
  return (
    <View style={styles.row}>
      {Array.from({ length: max }, (_, i) => {
        const circleValue = i + 1;
        return (
          <Pressable
            key={circleValue}
            onPress={() => !disabled && onChange?.(circleValue)}
            disabled={disabled}
            hitSlop={8}
          >
            <View
              style={[
                styles.circle,
                {
                  width: size,
                  height: size,
                  backgroundColor: circleValue <= value ? "#FFD700" : "#E0E0E0",
                  borderColor: circleValue <= value ? "#FFD700" : "#C0C0C0",
                },
              ]}
            />
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  circle: {
    borderRadius: 999,
    marginHorizontal: 1,
    borderWidth: 1,
  },
});
