import React, { useReducer, useMemo } from "react";
import { ConfirmationState } from "./types";
import { confirmationReducer } from "./store/reducer";
import {
  ConfirmationStateContext,
  ConfirmationDispatchContext,
} from "./store/context";

const initialState: ConfirmationState = {
  isVisible: false,
  title: "",
  message: "",
  confirmText: "Confirm",
  cancelText: "Cancel",
  onConfirm: null,
};

// --- Provider ---
interface ConfirmationProviderProps {
  children: React.ReactNode;
}
export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(confirmationReducer, initialState);
  const stateValue = useMemo(() => state, [state]);
  const dispatchValue = useMemo(() => dispatch, [dispatch]);
  return (
    <ConfirmationStateContext.Provider value={stateValue}>
      <ConfirmationDispatchContext.Provider value={dispatchValue}>
        {children}
      </ConfirmationDispatchContext.Provider>
    </ConfirmationStateContext.Provider>
  );
};
