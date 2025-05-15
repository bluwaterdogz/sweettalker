import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Fragment } from "react";
import { SideNav } from "@/features/navigation/components/SideNav";
import { useNavigation } from "@/features/navigation/components/NavigationContext";
import { Header } from "@/components/common";
import { userRoutes } from "./routes";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  const { isMenuOpen, closeMenu, toggleMenu } = useNavigation();
  const navigation = useNavigation();
  return (
    <Fragment>
      <Stack.Navigator
        initialRouteName="Reframing"
        screenOptions={{
          headerShown: true,
          header: ({ route, options }) => (
            <Header
              title={options.title || route.name}
              onLeftIconPress={toggleMenu}
              leftIcon={faBars}
              onRightIconPress={() => (navigation as any).navigate("Profile")}
              rightIcon={faUser}
            />
          ),
        }}
      >
        {userRoutes.map((route) => (
          <Stack.Screen
            key={route.name}
            name={route.name}
            component={route.component}
            options={route.options}
          />
        ))}
      </Stack.Navigator>
      <SideNav isOpen={isMenuOpen} onClose={closeMenu} />
    </Fragment>
  );
};
