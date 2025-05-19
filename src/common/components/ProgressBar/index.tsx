import React from "react";
import { View, StyleSheet, Text } from "react-native";
import SliderRN from "@react-native-community/slider";
import { useTheme } from "../../theme/hooks/useTheme";

interface ProgressBarProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  onValueChange,
  min = 1,
  max = 100,
  step = 1,
  disabled = false,
  label,
}) => {
  const { colors, typography } = useTheme();
  return (
    <View style={styles.container}>
      {label && (
        <Text style={[typography.labelMedium, styles.label]}>{label}</Text>
      )}
      <SliderRN
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.accent.primary}
        maximumTrackTintColor={colors.neutral[300]}
        thumbTintColor={colors.accent.primary}
        disabled={disabled}
      />
      <Text
        style={[
          typography.bodySmall,
          styles.value,
          { color: colors.text.secondary },
        ]}
      >
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { marginBottom: 8 },
  slider: { width: "100%" },
  value: { marginTop: 4, textAlign: "right" },
});
