import { useToast } from "@/lib/toast";
import * as ErrorTypes from ".";
import { useCallback } from "react";

type RetryFn = (() => Promise<any>) | null;

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

// For non-hook usage (e.g. in ErrorBoundary)
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

  if (retry) {
    retry();
  }
}

// Helper: Check for known custom error types
function isKnownAppError(error: unknown): error is {
  message: string;
  type: string;
} {
  return (
    error instanceof ErrorTypes.ApplicationError ||
    error instanceof ErrorTypes.ApiError ||
    error instanceof ErrorTypes.NetworkError ||
    error instanceof ErrorTypes.AuthError ||
    error instanceof ErrorTypes.ValidationError
  );
}
