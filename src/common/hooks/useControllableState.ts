import { useState, useCallback } from "react";

type UseControllableStateProps<T> = {
  value?: T;
  setValue?: (value: T) => void;
  defaultValue?: T;
  onChange?: (value: T) => void;
};

export function useControllableState<T>({
  value: controlledValue,
  defaultValue,
  onChange,
  setValue: controlledSetValue,
}: UseControllableStateProps<T>): [T, (value: T) => void] {
  const [internalValue, setInternalValue] = useState<T | undefined>(
    defaultValue
  );

  const isControlled = controlledSetValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const setValue = useCallback(
    (next: T) => {
      if (controlledSetValue) {
        controlledSetValue(next);
      } else if (!isControlled) {
        setInternalValue(next);
      }

      onChange?.(next);
    },
    [isControlled, onChange, controlledSetValue]
  );

  return [value as T, setValue];
}
