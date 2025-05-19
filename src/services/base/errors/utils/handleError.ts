import { useToast } from "@/common/features/Toast";
import { ApplicationError } from "../model/ApplicationError";
import { ApiError } from "../model/ApiError";
import { NetworkError } from "../model/NetworkError";
import { AuthError } from "../model/AuthError";
import { ValidationError } from "../model/ValidationError";
import { useCallback } from "react";

type RetryFn = (() => Promise<any>) | null;

const MAX_RETRIES = 3;

export function useHandleError() {
  const { showToast } = useToast();
  return useCallback(
    (error: unknown, retry?: RetryFn) => {
      let message = "An unknown error occurred";
      let type = "Unknown";

      if (isKnownAppError(error)) {
        message = error.message;
        type = error.type;
      } else if (error instanceof Error) {
        message = error.message;
        type = error.name;
      }

      showToast({
        type: "error",
        message: `[${type}] ${message}`,
        ...(retry && {
          action: {
            label: "Retry",
            onPress: retry,
          },
        }),
      });
    },
    [showToast]
  );
}

export function handleError(error: unknown, retry?: RetryFn) {
  let message = "An unknown error occurred";
  let type = "Unknown";

  if (isKnownAppError(error)) {
    message = error.message;
    type = error.type;
  } else if (error instanceof Error) {
    message = error.message;
    type = error.name;
  }

  retry?.();
}

// Helper: Check for known custom error types
function isKnownAppError(error: unknown): error is {
  message: string;
  type: string;
} {
  return (
    error instanceof ApplicationError ||
    error instanceof ApiError ||
    error instanceof NetworkError ||
    error instanceof AuthError ||
    error instanceof ValidationError
  );
}
