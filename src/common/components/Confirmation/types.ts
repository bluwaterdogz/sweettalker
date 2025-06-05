// --- Types ---
export interface ConfirmationState {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

export interface ShowConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export type ConfirmationAction =
  | { type: "SHOW"; payload: ShowConfirmationOptions }
  | { type: "HIDE" };
