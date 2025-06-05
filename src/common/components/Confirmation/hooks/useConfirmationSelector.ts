import { ConfirmationState } from "../types";
import { useConfirmationState } from "./useConfirmationState";

export const useConfirmationSelector = <T>(
  selector: (state: ConfirmationState) => T
): T => {
  const state = useConfirmationState();
  return selector(state);
};
