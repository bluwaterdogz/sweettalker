import { isFeatureEnabled } from "@/config/featureFlags";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";
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
        component={
          isFeatureEnabled("USE_FIREBASE_AUTH")
            ? FirebaseRegisterForm
            : RegisterForm
        }
        options={{ title: "Register" }}
      />
      <Stack.Screen
        name="Login"
        component={
          isFeatureEnabled("USE_FIREBASE_AUTH") ? FirebaseLoginForm : LoginForm
        }
        options={{ title: "Login" }}
      />
    </Stack.Navigator>
  );
};
