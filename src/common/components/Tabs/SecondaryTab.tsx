// SecondaryTab.tsx (Animated Oval Tabs)
import { useTheme } from "@/common/theme/hooks/useTheme";
import {
  Animated,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
} from "react-native";
import { useEffect, useRef } from "react";
import { TabProps } from "./Tab";

interface SecondaryTabProps extends TabProps {
  isFirst: boolean;
  isLast: boolean;
}

export const SecondaryTab = ({
  tab,
  isActive,
  disabled,
  onTabPress,
  setActiveTabId,
  isFirst,
  isLast,
}: SecondaryTabProps) => {
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

  const borderRadii = {
    borderTopLeftRadius: isFirst ? 999 : 0,
    borderBottomLeftRadius: isFirst ? 999 : 0,
    borderTopRightRadius: isLast ? 999 : 0,
    borderBottomRightRadius: isLast ? 999 : 0,
  };

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
            ...borderRadii,
          },
        ]}
      >
        <Animated.Text
          style={[
            typography.labelLarge,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRightWidth: 0,
  },
});
