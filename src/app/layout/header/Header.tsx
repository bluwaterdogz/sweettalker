import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface HeaderProps {
  title?: string;
  leftIcon?: IconProp;
  onLeftIconPress?: () => void;
  onRightIconPress?: () => void;
  rightContent?: React.ReactNode;
  leftContent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightContent,
  onLeftIconPress,
  onRightIconPress,
  leftContent,
}) => {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
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
        {leftContent && (
          <TouchableOpacity onPress={onLeftIconPress} style={styles.iconButton}>
            {leftContent}
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
        {rightContent && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconButton}
          >
            {rightContent}
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
    flexDirection: "row",
    alignItems: "flex-start",
  },
  rightContainer: {
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
