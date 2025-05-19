import React, { useState } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useTheme } from "../../theme/hooks/useTheme";
import { DrawerHandle } from "./DrawerHandle";
import { common } from "../../styles";

interface DrawerProps {
  isOpen?: boolean;
  setIsOpen?: () => void;
  height?: number;
  children: React.ReactNode;
  showHandle?: boolean;
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const [isOpenState, setIsOpenState] = useState<boolean>(false);
  const {
    isOpen = isOpenState,
    setIsOpen = setIsOpenState,
    height = 550,
    children,
    showHandle = true,
  } = props;
  const { colors } = useTheme();
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    Animated.timing(translateY, {
      toValue: isOpen ? 0 : height,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen, height, translateY]);

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          height,
          backgroundColor: colors.background.secondary,
          transform: [{ translateY }],
        },
        common.shadow,
      ]}
    >
      {showHandle && <DrawerHandle onPress={() => setIsOpen(!isOpen)} />}
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
});

export { DrawerHandle };
