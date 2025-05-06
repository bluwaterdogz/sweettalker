import { useAppSelector } from "@/store";
import { isFeatureEnabled } from "@/config/featureFlags";
import { FEATURE_FLAGS } from "@/config/featureFlags";

export const useAuthSystem = () => {
  const useFirebaseAuth = isFeatureEnabled("USE_FIREBASE_AUTH");
  const firebaseUser = useAppSelector((state) => state.firebaseAuth.user);
  const appUser = useAppSelector((state) => state.auth.user);

  return {
    isAuthenticated: useFirebaseAuth ? !!firebaseUser : !!appUser,
    user: useFirebaseAuth ? firebaseUser : appUser,
    useFirebaseAuth,
  };
};
