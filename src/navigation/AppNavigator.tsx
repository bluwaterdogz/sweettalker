import { AppStack } from "./AppStack";
import { AuthStack } from "./AuthStack";
import { useUser } from "@/features/auth/hooks/useUser";

export const AppNavigator = () => {
  const { user } = useUser();
  return user != null ? <AppStack /> : <AuthStack />;
};
