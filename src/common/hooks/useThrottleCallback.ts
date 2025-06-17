import { useRef, useCallback } from "react";

export function useThrottleCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastCall = useRef(0);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (now - lastCall.current >= delay) {
        lastCall.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}
