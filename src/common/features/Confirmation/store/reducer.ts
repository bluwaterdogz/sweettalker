import { ConfirmationState, ConfirmationAction } from "../types";

export function confirmationReducer(
  state: ConfirmationState,
  action: ConfirmationAction
): ConfirmationState {
  switch (action.type) {
    case "SHOW":
      return {
        isVisible: true,
        title: action.payload.title,
        message: action.payload.message,
        confirmText: action.payload.confirmText || "Confirm",
        cancelText: action.payload.cancelText || "Cancel",
        onConfirm: action.payload.onConfirm,
      };
    case "HIDE":
      return { ...state, isVisible: false, onConfirm: null };
    default:
      return state;
  }
}
