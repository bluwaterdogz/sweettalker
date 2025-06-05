import { useEffect, useRef } from "react";

type UseTypingStatusOptions = {
  typingDebounceMs?: number;
  onTyping: () => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
};

export function useTypingStatus(
  value: string,
  {
    typingDebounceMs = 1000,
    onTyping,
    onTypingStart,
    onTypingEnd,
  }: UseTypingStatusOptions
) {
  const lastValue = useRef<string>("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTypingRef = useRef(false);

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

    const valueChanged = trimmed !== lastValue.current;

    if (valueChanged) {
      lastValue.current = trimmed;

      if (!isTypingRef.current) {
        isTypingRef.current = true;
        onTypingStart?.();
      }

      onTyping();
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (isTypingRef.current) {
        isTypingRef.current = false;
        onTypingEnd?.();
      }
    }, typingDebounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, typingDebounceMs, onTyping, onTypingStart, onTypingEnd]);
}
