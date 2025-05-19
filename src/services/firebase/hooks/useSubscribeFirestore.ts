import { useEffect, useState, useRef } from "react";

export function useSubscribeFirestore<T>(
  subscribeFn: (
    onData: (data: T) => void,
    onError?: (err: Error) => void
  ) => () => void,
  options: {
    deps?: any[];
    defaultValue?: T | null;
    onData?: (data: T) => void;
    onError?: (err: Error) => void;
  } = {}
) {
  const { defaultValue = null, deps = [], onData, onError } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<T | null>(defaultValue);
  const [optimisticValue, setOptimisticValue] = useState<T | null>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeFn(
      (data) => {
        setResult(data);
        setLoading(false);
        setOptimisticValue(null);
        isFirstLoad.current = false;
        onData?.(data);
      },
      (err) => {
        setError(err?.message || "Unknown error");
        setLoading(false);
        onError?.(err);
      }
    );
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // If optimisticValue is set, use it as the result
  const displayResult = optimisticValue !== null ? optimisticValue : result;

  return {
    loading,
    error,
    result: displayResult,
    setResult,
    setOptimisticValue,
  };
}
