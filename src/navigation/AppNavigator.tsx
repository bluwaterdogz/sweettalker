import { useAppSelector } from "@/store";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useCheckAuth as useCheckTokenAuth } from "@/features/auth/hooks/useCheckAuth";
import { useCheckAuth as useCheckFirebaseAuth } from "@/features/firebase-auth/hooks/useCheckAuth";
import { isFeatureEnabled } from "@/config/featureFlags";
import { useAuthSystem } from "@/features/auth/hooks/useAuthSystem";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthSystem();
  const useFirebaseAuth = isFeatureEnabled("USE_FIREBASE_AUTH");

  // Use the appropriate auth check based on the feature flag
  if (useFirebaseAuth) {
    useCheckFirebaseAuth();
  } else {
    useCheckTokenAuth();
  }

  return user != null ? <AppStack /> : <AuthStack />;
};
