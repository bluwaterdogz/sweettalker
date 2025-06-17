import React, { useEffect, useState } from "react";
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  ModalProps as RNModalProps,
  Text,
} from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Button } from "@/common/components/Button";

export interface ActionButton {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
}

export interface ModalProps extends Partial<RNModalProps> {
  visible: boolean;
  onClose?: () => void;
  children?: React.ReactNode;

  // Content
  title?: string;
  message?: string;

  // Actions
  actions?: ActionButton[];
  primaryAction?: ActionButton;
  secondaryAction?: ActionButton;
  actionsDirection?: "row" | "column";

  // Animation
  animationType?: "fade" | "slide" | "none";
  animationDuration?: number;

  // Backdrop
  showBackdrop?: boolean;
  backdropOpacity?: number;
  backdropColor?: string;
  closeOnBackdropPress?: boolean;

  // Positioning
  position?: "center" | "top" | "bottom" | "fullscreen";

  // Styling
  containerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  title,
  message,
  actions,
  primaryAction,
  secondaryAction,
  actionsDirection = "row",
  animationType = "fade",
  animationDuration = 300,
  showBackdrop = true,
  backdropOpacity = 0.5,
  backdropColor,
  closeOnBackdropPress = true,
  position = "center",
  containerStyle,
  contentStyle,
  ...modalProps
}) => {
  const { colors, typography } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(
    new Animated.Value(position === "bottom" ? 300 : -300)
  );

  useEffect(() => {
    if (visible) {
      if (animationType === "fade") {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      } else if (animationType === "slide") {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      }
    } else {
      if (animationType === "fade") {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      } else if (animationType === "slide") {
        Animated.timing(slideAnim, {
          toValue: position === "bottom" ? 300 : -300,
          duration: animationDuration,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [
    visible,
    animationType,
    animationDuration,
    fadeAnim,
    slideAnim,
    position,
  ]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose?.();
    }
  };

  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flex: 1,
      backgroundColor: "transparent",
    };

    switch (position) {
      case "top":
        return { ...baseStyle, justifyContent: "flex-start" };
      case "bottom":
        return { ...baseStyle, justifyContent: "flex-end" };
      case "fullscreen":
        return { ...baseStyle };
      case "center":
      default:
        return { ...baseStyle, justifyContent: "center", alignItems: "center" };
    }
  };

  const getContentStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: colors.background.primary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    };

    if (position === "fullscreen") {
      return { ...baseStyle, flex: 1 };
    }

    return {
      ...baseStyle,
      borderRadius: 12,
      margin: 20,
      padding: 20,
      minWidth: 280,
      maxWidth: 400,
    };
  };

  const getAnimatedStyle = () => {
    if (animationType === "fade") {
      return { opacity: fadeAnim };
    } else if (animationType === "slide") {
      return { transform: [{ translateY: slideAnim }] };
    }
    return {};
  };

  // Combine all actions
  const allActions = React.useMemo(() => {
    const actionsList: ActionButton[] = [];

    if (actions) {
      actionsList.push(...actions);
    } else {
      if (secondaryAction) actionsList.push(secondaryAction);
      if (primaryAction) actionsList.push(primaryAction);
    }

    return actionsList;
  }, [actions, primaryAction, secondaryAction]);

  const renderActions = () => {
    if (allActions.length === 0) return null;

    return (
      <View
        style={[
          styles.actionsContainer,
          actionsDirection === "column" && styles.actionsColumn,
        ]}
      >
        {allActions.map((action, index) => (
          <Button
            key={index}
            title={action.title}
            onPress={action.onPress}
            variant={action.variant}
            disabled={action.disabled}
            loading={action.loading}
            style={[
              styles.actionButton,
              actionsDirection === "row" && { flex: 1 },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      {...modalProps}
    >
      <View style={[getContainerStyle(), containerStyle]}>
        {/* Backdrop */}
        {showBackdrop && (
          <TouchableOpacity
            style={[
              StyleSheet.absoluteFillObject,
              {
                backgroundColor: backdropColor || colors.background.primary,
                opacity: backdropOpacity,
              },
            ]}
            activeOpacity={1}
            onPress={handleBackdropPress}
          />
        )}

        {/* Content */}
        <Animated.View
          style={[getContentStyle(), getAnimatedStyle(), contentStyle]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            style={{ flex: position === "fullscreen" ? 1 : undefined }}
          >
            {/* Header */}
            {title && (
              <Text
                style={[
                  typography.headingMedium,
                  styles.title,
                  { color: colors.text.primary },
                ]}
              >
                {title}
              </Text>
            )}

            {/* Message */}
            {message && (
              <Text
                style={[
                  typography.bodyMedium,
                  styles.message,
                  { color: colors.text.secondary },
                ]}
              >
                {message}
              </Text>
            )}

            {/* Custom Content */}
            {children && <View style={styles.content}>{children}</View>}

            {/* Actions */}
            {renderActions()}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    textAlign: "center",
    marginBottom: 20,
  },
  content: {
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  actionsColumn: {
    flexDirection: "column",
  },
  actionButton: {
    minHeight: 44,
  },
});
