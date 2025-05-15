import { useAppSelector } from "@/store";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useCheckAuth } from "@/features/firebase-auth/hooks/useCheckAuth";

export const AppNavigator = () => {
  const { user } = useAppSelector((state) => state.firebaseAuth);

  // Use the appropriate auth check based on the feature flag
  useCheckAuth();

  return user != null ? <AppStack /> : <AuthStack />;
};
