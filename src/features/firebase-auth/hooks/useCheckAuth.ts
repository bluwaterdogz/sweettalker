import { useAppDispatch } from "@/store";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { setUser } from "../slice";
import { auth } from "@/firebase";
import { mapFirebaseUser } from "../api/mappers";
import { isMockAuthEnabled, mockUser } from "../api/mock";

export function useCheckAuth() {
  const dispatcher = useAppDispatch();

  useEffect(() => {
    if (isMockAuthEnabled()) {
      dispatcher(setUser({ user: mockUser }));
      return;
    } else {
      // Set up the auth state listener
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, map the Firebase user to our app's user model
          const mappedUser = mapFirebaseUser(user);
          dispatcher(setUser({ user: mappedUser }));
        } else {
          // User is signed out, clear the user from state
          dispatcher(setUser({ user: undefined }));
        }
      });

      // Clean up subscription on unmount
      return () => unsubscribe();
    }
  }, [dispatcher]);
}
