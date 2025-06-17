import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import throttle from "lodash/throttle";

interface PromiseState<T> {
  data: T | undefined;
  error: Error | null;
  isLoading: boolean;
}

interface UsePromiseResult<T> extends PromiseState<T> {
  refresh: (...args: any[]) => Promise<void>;
  reset: () => void;
}

interface UsePromiseOptions {
  throttleMs?: number;
}

type ThrottledFunction = {
  (...args: any[]): Promise<void>;
  cancel: () => void;
};

export function usePromise<T>(
  promiseFn: (...args: any[]) => Promise<T>,
  initialData: T | undefined = undefined,
  dependencies: any[] = [],
  options: UsePromiseOptions = {}
): UsePromiseResult<T> {
  const [state, setState] = useState<PromiseState<T>>({
    data: initialData,
    error: null,
    isLoading: false,
  });

  // Keep track of the latest promise to handle race conditions
  const latestPromise = useRef<Promise<T> | null>(null);
  // Store the promise function in a ref to avoid dependency issues
  const promiseFnRef = useRef(promiseFn);
  promiseFnRef.current = promiseFn;

  const execute = useCallback(
    async (...args: any[]) => {
      const currentPromise = promiseFnRef.current(...args);
      latestPromise.current = currentPromise;

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const data = await currentPromise;

        // Only update state if this is still the latest promise
        if (latestPromise.current === currentPromise) {
          setState({ data, error: null, isLoading: false });
        }
      } catch (error) {
        // Only update state if this is still the latest promise
        if (latestPromise.current === currentPromise) {
          setState({
            data: undefined,
            error: error instanceof Error ? error : new Error(String(error)),
            isLoading: false,
          });
        }
      }
    },
    [] // No dependencies needed since we use refs
  );

  // Create throttled execute function if throttleMs is provided
  const throttledExecute = useMemo(
    () =>
      throttle(
        execute,
        options.throttleMs ?? 0, // Use 0ms throttle if not specified
        { leading: true, trailing: true }
      ),
    [execute, options.throttleMs]
  ) as ThrottledFunction;

  const reset = useCallback(() => {
    setState({
      data: initialData,
      error: null,
      isLoading: false,
    });
  }, [initialData]);

  // Auto-execute when dependencies change
  useEffect(() => {
    throttledExecute();
    // Cleanup function to mark the current promise as stale and cancel throttled execution
    return () => {
      latestPromise.current = null;
      throttledExecute.cancel();
    };
  }, dependencies); // Only depend on the provided dependencies

  return {
    ...state,
    refresh: throttledExecute,
    reset,
  };
}
