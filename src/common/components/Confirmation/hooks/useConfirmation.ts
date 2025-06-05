import { useCallback } from "react";
import { ShowConfirmationOptions } from "../types";
import { useConfirmationDispatch } from "./useConfirmationDispatch";

export const useConfirmation = () => {
  const dispatch = useConfirmationDispatch();
  return useCallback(
    (options: ShowConfirmationOptions) => {
      dispatch({ type: "SHOW", payload: options });
    },
    [dispatch]
  );
};
