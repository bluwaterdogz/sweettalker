import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Text,
} from "react-native";
import { useTheme } from "../../../../theme/hooks/useTheme";
import { Button } from "../../../Button";
import { useConfirmationSelector } from "../../hooks/useConfirmationSelector";
import { useConfirmationDispatch } from "../../hooks/useConfirmationDispatch";
import { useTranslation } from "@/i18n/hooks/useTranslation";

export const Confirmation: React.FC<{}> = () => {
  const isVisible = useConfirmationSelector((state) => state.isVisible);
  const title = useConfirmationSelector((state) => state.title);
  const message = useConfirmationSelector((state) => state.message);
  const state = useConfirmationSelector((state) => state);
  const onConfirmCallback = useConfirmationSelector((state) => state.onConfirm);
  const onCancelCallback = useConfirmationSelector((state) => state.onCancel);
  const confirmText = useConfirmationSelector((state) => state.confirmText);
  const cancelText = useConfirmationSelector((state) => state.cancelText);
  const dispatch = useConfirmationDispatch();
  const { t } = useTranslation();

  const onCancel = useCallback(() => {
    onCancelCallback?.();
    dispatch({ type: "HIDE" });
  }, [dispatch]);

  const { colors, typography } = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 0.5,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleConfirm = () => {
    if (onConfirmCallback) onConfirmCallback();
    onCancel(); // Close the modal after confirmation
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={onCancel}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onCancel}
      >
        <Animated.View
          style={[
            styles.overlay,
            {
              backgroundColor: colors.background.primary,
              opacity: fadeAnim,
            },
          ]}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
          style={styles.contentContainer}
        >
          <View
            style={[
              styles.content,
              {
                backgroundColor: colors.background.primary,
              },
            ]}
          >
            <Text
              style={[
                typography.headingMedium,
                styles.title,
                {
                  color: colors.text.primary,
                },
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                typography.bodyMedium,
                styles.message,
                {
                  color: colors.text.secondary,
                },
              ]}
            >
              {message}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                title={cancelText || t("common.cancel")}
                onPress={onCancel}
                variant="outline"
                style={styles.button}
              />
              <Button
                title={confirmText || t("common.confirm")}
                onPress={handleConfirm}
                style={styles.button}
              />
            </View>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
