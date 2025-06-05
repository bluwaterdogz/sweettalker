import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { publicRoutes } from "./routes";

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true, // You can also customize globally here
      }}
    >
      {publicRoutes.map((route) => (
        <Stack.Screen
          key={route.name}
          name={route.name}
          component={route.component}
          options={route.options}
        />
      ))}
    </Stack.Navigator>
  );
};
