import { FirebaseLoginForm } from "@/features/firebase-auth/components/login-form";
import { FirebaseRegisterForm } from "@/features/firebase-auth/components/register-form";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: true, // You can also customize globally here
      }}
    >
      <Stack.Screen
        name="Register"
        component={FirebaseRegisterForm}
        options={{ title: "Register" }}
      />
      <Stack.Screen
        name="Login"
        component={FirebaseLoginForm}
        options={{ title: "Login" }}
      />
    </Stack.Navigator>
  );
};
