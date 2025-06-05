import { useContext } from "react";
import { ConfirmationDispatchContext } from "../store/context";

export const useConfirmationDispatch = () => {
  const ctx = useContext(ConfirmationDispatchContext);
  if (!ctx)
    throw new Error(
      "useConfirmationDispatch must be used within ConfirmationProvider"
    );
  return ctx;
};
