import { isEqual } from "lodash";
import { useEffect, useRef } from "react";
import { useThrottleCallback } from "@/common/hooks/useThrottleCallback";

type UseTypingStatusOptions = {
  typingDebounceMs?: number;
  onTyping: () => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  throttle?: boolean;
};

export function useTypingStatus(
  value: string,
  {
    typingDebounceMs = 1000,
    onTyping,
    onTypingStart,
    onTypingEnd,
    throttle = false,
  }: UseTypingStatusOptions
) {
  const lastValue = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

  const throttledTyping = useThrottleCallback(onTyping, typingDebounceMs);
  const handleTyping = throttle ? throttledTyping : onTyping;

  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed === "") {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingEnd?.();
      }
      lastValue.current = "";
      return;
    }

    const valueChanged = !isEqual(trimmed, lastValue.current);
    lastValue.current = trimmed;

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    }

    if (valueChanged) {
      handleTyping();
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingEnd?.();
      }
    }, typingDebounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [
    value,
    handleTyping,
    typingDebounceMs,
    onTypingStart,
    onTypingEnd,
    throttle,
  ]);
}
