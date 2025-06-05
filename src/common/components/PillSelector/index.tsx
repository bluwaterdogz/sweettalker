import React, { useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Icon } from "../Icon";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Pill, PillProps } from "../Pill";
import { isEqual } from "lodash";

interface PillSelectorProps<T> {
  pills: PillProps<T>[];
  value: T[];
  setValue: (value: T[]) => void;
  containerStyle?: ViewStyle;
  pillStyle?: ViewStyle;
  labelStyle?: TextStyle;
  disabled?: boolean;
  maxSelect?: number;
  showPillX?: boolean;
}

export function PillSelector<T>({
  pills,
  value,
  setValue,
  containerStyle,
  pillStyle,
  labelStyle,
  disabled = false,
  maxSelect,
  showPillX = true,
}: PillSelectorProps<T>) {
  const { colors } = useTheme();

  const handlePillPress = useCallback(
    (pill: PillProps<T> & { isSelected: boolean }) => {
      if (disabled || pill.disabled) return;
      if (pill.isSelected) {
        const newValue = value.filter((v) => !isEqual(v, pill.value));
        setValue(newValue);
      } else {
        const newValue =
          maxSelect && value.length >= maxSelect
            ? [...value.slice(1), pill.value]
            : [...value, pill.value];

        setValue(newValue);
      }
    },
    [value, setValue, disabled, maxSelect]
  );

  const populatedPills = useMemo(() => {
    return pills.map((pill) => {
      const isSelected = value.some((v) => isEqual(v, pill.value));
      return { ...pill, isSelected };
    });
  }, [pills, value]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.pillContainer}>
        {populatedPills.map((pill) => {
          const { key, ...pillProps } = pill as any;
          return (
            <View key={key}>
              <Pill
                {...pillProps}
                showX={showPillX}
                style={pillStyle}
                onClick={() => handlePillPress(pill)}
              />
            </View>
          );
        })}
      </View>
      <View style={styles.clearButtonContainer}>
        <Pressable
          onPress={() => {
            setValue([]);
          }}
          style={styles.clearButton}
        >
          <Icon icon={faXmark} size={20} color={colors.text.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  pillContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  clearButton: {
    position: "absolute",
    right: 0,
    top: 0,
  },
  clearButtonContainer: {
    display: "flex",
    alignItems: "center",
    minWidth: 20,
  },
});
