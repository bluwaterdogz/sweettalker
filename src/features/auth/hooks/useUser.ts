import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/app/firebase";
import { createSingletonHook } from "@/common/hooks/createSingletonHook";
import { isMockAuthEnabled, mockUser } from "../api/mock";

interface UserState {
  user: User | null;
  loading: boolean;
  error: unknown;
}

const getInitialState = (): UserState => ({
  user: null,
  loading: true,
  error: null,
});

export const useUser = createSingletonHook<UserState>((setState) => {
  if (isMockAuthEnabled()) {
    setState({ user: mockUser, loading: false, error: null });
    return () => {};
  }
  setState({ user: null, loading: true, error: null });
  const unsubscribe = onAuthStateChanged(
    auth,
    (firebaseUser) => {
      setState({ user: firebaseUser, loading: false, error: null });
    },
    (err) => {
      setState({ user: null, loading: false, error: err });
    }
  );
  return unsubscribe;
}, getInitialState);
