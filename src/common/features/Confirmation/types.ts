// --- Types ---
export interface ConfirmationState {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
}

export interface ShowConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

export type ConfirmationAction =
  | { type: "SHOW"; payload: ShowConfirmationOptions }
  | { type: "HIDE" };
