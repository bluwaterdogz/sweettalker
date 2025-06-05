import { useTheme } from "@/common/theme/hooks/useTheme";
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import { Tab as TabI } from "./types";

export interface TabProps {
  tab: TabI;
  isActive: boolean;
  disabled: boolean;
  onTabPress?: (tabId: string) => void;
  setActiveTabId: (tabId: string) => void;
}

export const Tab = ({
  tab,
  isActive,
  disabled,
  onTabPress,
  setActiveTabId,
}: TabProps) => {
  const { colors, typography } = useTheme();
  const animation = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.background.secondary, colors.background.primary],
  });

  const textColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.text.secondary, colors.text.primary],
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (!disabled) {
          onTabPress?.(tab.id);
          setActiveTabId(tab.id);
        }
      }}
      disabled={disabled}
    >
      <Animated.View
        style={[
          styles.tab,
          {
            backgroundColor,
            borderColor: colors.background.secondary,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <Animated.Text
          style={[
            typography.labelLarge,
            styles.tabText,
            {
              color: textColor,
            },
          ]}
        >
          {tab.label}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 0,
    justifyContent: "center",
  },
  tabText: {
    textAlign: "center",
  },
});
