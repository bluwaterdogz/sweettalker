import { NavigationContainer } from "@react-navigation/native";
import { memo } from "react";
import { SafeAreaView } from "react-native";
import { NavigationProvider } from "@/common/components/Navigation/NavigationContext";
import { Host } from "react-native-portalize";
import { AuthStack } from "./AuthStack";
import { AppStack } from "./AppStack";
import { useUser } from "@/features/auth/hooks/useUser";
import { Loader } from "@/common/components/Loader";

export const MainNavigator = memo(() => {
  const { user, loading } = useUser();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Host>
        <NavigationContainer>
          <NavigationProvider>
            {loading ? <Loader /> : user != null ? <AppStack /> : <AuthStack />}
          </NavigationProvider>
        </NavigationContainer>
      </Host>
    </SafeAreaView>
  );
});
