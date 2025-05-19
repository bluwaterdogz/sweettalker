import { useTheme } from "../../theme/hooks/useTheme";
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

export const DrawerHandle: React.FC<{
  onPress?: () => void;
  style?: any;
}> = ({ onPress, style }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.handleContainer, style]}>
      <View
        style={[styles.handle, { backgroundColor: colors.text.secondary }]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  handleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.5,
  },
});
