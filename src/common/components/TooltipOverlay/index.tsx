import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableOpacity,
  findNodeHandle,
} from "react-native";

import { useTheme } from "@/common/theme/hooks/useTheme";
import { Icon } from "@/common/components/Icon";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface TooltipOverlayProps {
  visible: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<any>;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: any;
  contentStyle?: any;
}

export const TooltipOverlay: React.FC<TooltipOverlayProps> = ({
  visible,
  onClose,
  anchorRef,
  title,
  subtitle,
  children,
  style,
  contentStyle,
}) => {
  const { colors } = useTheme();
  const [anchorLayout, setAnchorLayout] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);

  // Measure anchor position
  useEffect(() => {
    if (visible && anchorRef?.current) {
      const handle = findNodeHandle(anchorRef.current);
      if (handle) {
        setTimeout(() => {
          anchorRef.current.measureInWindow(
            (x: number, y: number, width: number, height: number) => {
              setAnchorLayout({ x, y, width, height });
            }
          );
        }, 10);
      }
    } else {
      setAnchorLayout(null);
    }
  }, [visible, anchorRef?.current]);

  // Glow effect: render a highlight overlay on the anchor
  const Glow = () => {
    if (!anchorLayout) return null;
    return (
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            left: anchorLayout.x - 8,
            top: anchorLayout.y - 8,
            width: anchorLayout.width + 16,
            height: anchorLayout.height + 16,
            borderRadius: 16,
            borderWidth: 3,
            borderColor: colors.accent.primary,
            shadowColor: colors.accent.primary,
            shadowOpacity: 0.6,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 0 },
            elevation: 8,
            zIndex: 1000,
          },
        ]}
      />
    );
  };

  // Position overlay near anchor, or center if not found
  const overlayStyle = anchorLayout
    ? {
        position: "absolute" as const,
        left: Math.max(16, anchorLayout.x + anchorLayout.width / 2 - 180),
        top: anchorLayout.y + anchorLayout.height + 12,
        zIndex: 1001,
        width: 360,
        maxWidth: Dimensions.get("window").width - 32,
      }
    : {
        position: "absolute" as const,
        left: 32,
        right: 32,
        top: Dimensions.get("window").height / 2 - 120,
        zIndex: 1001,
      };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {visible && anchorLayout && <Glow />}
        <View style={[styles.overlay, overlayStyle, style]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Icon icon={faXmark} size={22} color={colors.text.secondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              {subtitle}
            </Text>
          ) : null}
          <View style={[styles.content, contentStyle]}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    minWidth: 280,
    maxWidth: 400,
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 18,
  },
  content: {
    marginTop: 8,
  },
});

export default TooltipOverlay;
