import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { useTheme } from "../../../theme/context";
import { Icon } from "../Icon";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface DrawerProps {
  open?: boolean;
  onClose?: () => void;
  width?: number;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = (props: DrawerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    open = isOpen,
    onClose = () => setIsOpen(false),
    width = 300,
    children,
  } = props;
  const { colors } = useTheme();
  const translateX = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: open ? 0 : -width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [open, width, translateX]);

  return (
    <Animated.View
      style={[
        styles.drawer,
        {
          width,
          backgroundColor: colors.background.paper,
          transform: [{ translateX }],
        },
      ]}
    >
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Icon icon={faXmark} size={24} color={colors.text.primary} />
      </TouchableOpacity>
      <View style={styles.content}>{children}</View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 12,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
