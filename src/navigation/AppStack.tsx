import { useAuthInterceptors } from "@/features/auth/hooks/useAuthInterceptors";
import { Translate } from "@/features/translation/components";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Fragment } from "react";
import { NavigationMenu } from "@/features/navigation/NavigationMenu";
import { useNavigation } from "@/features/navigation/NavigationContext";
import { Profile } from "@/features/profile/components";
import { BillingScreen } from "@/features/billing/components/BillingScreen";
import { Header } from "@/components/common/Header";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const { isMenuOpen, closeMenu, toggleMenu } = useNavigation();

  useAuthInterceptors();
  return (
    <Fragment>
      <Stack.Navigator
        initialRouteName="Translation"
        screenOptions={{
          headerShown: true,
          header: ({ route, options }) => (
            <Header
              title={options.title || route.name}
              onMenuPress={toggleMenu}
            />
          ),
        }}
      >
        <Stack.Screen
          name="Translation"
          component={Translate}
          options={{ title: "Translation" }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="Billing"
          component={BillingScreen}
          options={{ title: "Billing" }}
        />
      </Stack.Navigator>
      <NavigationMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </Fragment>
  );
};
