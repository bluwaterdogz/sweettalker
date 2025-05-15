import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useTheme } from "../../../theme/context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface HeaderProps {
  title: string;
  leftIcon?: IconProp;
  rightIcon?: IconProp;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  onLeftIconPress,
  onRightIconPress,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.default }]}
    >
      <View style={styles.leftContainer}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftIconPress} style={styles.iconButton}>
            <FontAwesomeIcon
              icon={leftIcon}
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <Text
        style={[
          typography.titleLarge,
          { color: colors.text.primary },
          styles.title,
        ]}
        numberOfLines={1}
      >
        {title}
      </Text>

      <View style={styles.rightContainer}>
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
          >
            <FontAwesomeIcon
              icon={rightIcon}
              size={24}
              color={colors.text.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    flex: 1,
    textAlign: "center",
  },
  iconButton: {
    padding: 8,
  },
});
