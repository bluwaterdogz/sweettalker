import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Icon } from "@/common/components/Icon";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "@/common/components/Modal";

interface TooltipOverlayProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
}

export const TooltipOverlay: React.FC<TooltipOverlayProps> = ({
  visible,
  onClose,
  title,
  children,
  style,
  contentStyle,
}) => {
  return (
    <Modal
      onClose={onClose}
      visible={visible}
      transparent
      animationType="fade"
      title={title}
    >
      <View style={[styles.container, style]}>
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
  },
  content: {
    marginTop: 8,
    width: "100%",
  },
});

export default TooltipOverlay;
