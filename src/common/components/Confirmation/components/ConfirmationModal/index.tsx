import React, { useCallback } from "react";
import { Modal } from "@/common/components/Modal";
import { useConfirmationSelector } from "../../hooks/useConfirmationSelector";
import { useConfirmationDispatch } from "../../hooks/useConfirmationDispatch";
import { useTranslation } from "@/i18n/hooks/useTranslation";

export const Confirmation: React.FC<{}> = () => {
  const isVisible = useConfirmationSelector((state) => state.isVisible);
  const title = useConfirmationSelector((state) => state.title);
  const message = useConfirmationSelector((state) => state.message);
  const onConfirmCallback = useConfirmationSelector((state) => state.onConfirm);
  const onCancelCallback = useConfirmationSelector((state) => state.onCancel);
  const confirmText = useConfirmationSelector((state) => state.confirmText);
  const cancelText = useConfirmationSelector((state) => state.cancelText);
  const dispatch = useConfirmationDispatch();
  const { t } = useTranslation();

  const onCancel = useCallback(() => {
    onCancelCallback?.();
    dispatch({ type: "HIDE" });
  }, [dispatch, onCancelCallback]);

  const handleConfirm = useCallback(() => {
    if (onConfirmCallback) onConfirmCallback();
    dispatch({ type: "HIDE" });
  }, [onConfirmCallback, dispatch]);

  return (
    <Modal
      visible={isVisible}
      onClose={onCancel}
      title={title}
      message={message}
      secondaryAction={{
        title: cancelText || t("common.cancel"),
        onPress: onCancel,
        variant: "outline",
      }}
      primaryAction={{
        title: confirmText || t("common.confirm"),
        onPress: handleConfirm,
        variant: "primary",
      }}
    />
  );
};
