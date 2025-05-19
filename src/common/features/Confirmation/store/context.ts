import { ConfirmationState } from "../types";

import { createContext } from "react";
import { ConfirmationAction } from "../types";

// --- Contexts ---
export const ConfirmationStateContext = createContext<
  ConfirmationState | undefined
>(undefined);
export const ConfirmationDispatchContext = createContext<
  React.Dispatch<ConfirmationAction> | undefined
>(undefined);
