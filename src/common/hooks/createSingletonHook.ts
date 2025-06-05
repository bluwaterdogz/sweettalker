import { useEffect, useState } from "react";

/**
 * Creates a singleton hook with shared state and subscription.
 * The subscription is cleaned up when the last instance unmounts.
 * @param subscribeFn - function that sets up the subscription and returns an unsubscribe function
 * @param getInitialState - function that returns the initial state
 */
export function createSingletonHook<T>(
  subscribeFn: (setState: (state: T) => void) => () => void,
  getInitialState: () => T
) {
  let state = getInitialState();
  let setStates: Array<(state: T) => void> = [];
  let unsubscribe: (() => void) | null = null;
  let refCount = 0;

  function setAll(newState: T) {
    state = newState;
    setStates.forEach((set) => set(state));
  }

  return function useSingleton() {
    const [localState, setLocalState] = useState<T>(state);

    useEffect(() => {
      setStates.push(setLocalState);
      refCount++;
      if (refCount === 1) {
        unsubscribe = subscribeFn(setAll);
      }
      // Sync local state in case it changed before mount
      setLocalState(state);
      return () => {
        setStates = setStates.filter((set) => set !== setLocalState);
        refCount--;
        if (refCount === 0 && unsubscribe) {
          unsubscribe();
          unsubscribe = null;
          state = getInitialState();
        }
      };
    }, []);

    return localState;
  };
}
