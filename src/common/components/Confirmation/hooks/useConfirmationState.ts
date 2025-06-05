import { useContext } from "react";
import { ConfirmationStateContext } from "../store/context";

export const useConfirmationState = () => {
  const ctx = useContext(ConfirmationStateContext);
  if (!ctx)
    throw new Error(
      "useConfirmationState must be used within ConfirmationProvider"
    );
  return ctx;
};
