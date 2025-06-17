import { useEffect, useState, useRef } from "react";
import { Unsubscribe } from "firebase/firestore";

interface UseSubscribeFirestoreOptions<T> {
  deps?: any[];
  defaultValue?: T | undefined;
  enabled?: boolean;
  onData?: (data: T) => void;
  onError?: (err: Error) => void;
}

export function useSubscribeFirestore<T>(
  subscribeFn: (
    onData: (data: T) => void,
    onError?: (err: Error) => void
  ) => Unsubscribe,
  options: UseSubscribeFirestoreOptions<T> = {}
) {
  const {
    defaultValue = undefined,
    deps = [],
    onData,
    onError,
    enabled = true,
  } = options;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<T | undefined>(defaultValue);
  const [optimisticValue, setOptimisticValue] = useState<T | undefined>(
    undefined
  );
  const [hasFetched, setHasFetched] = useState(false);
  const isFirstLoad = useRef(true);
  const currentDeps = useRef(deps);

  useEffect(() => {
    if (!enabled) return;

    // Check if dependencies have changed
    const depsChanged = deps.some(
      (dep, index) => dep !== currentDeps.current[index]
    );
    if (depsChanged) {
      setHasFetched(false);
      currentDeps.current = deps;
    }

    setLoading(true);
    setError(null);
    const unsubscribe = subscribeFn(
      (data) => {
        setResult(data);
        setLoading(false);
        setOptimisticValue(undefined);
        setHasFetched(true);
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
  }, [enabled, ...deps]);

  // If optimisticValue is set, use it as the result
  const displayResult = optimisticValue != null ? optimisticValue : result;

  return {
    loading,
    // TODO: turn into error object
    error,
    result: displayResult,
    setResult,
    setOptimisticValue,
    hasFetched,
  };
}
