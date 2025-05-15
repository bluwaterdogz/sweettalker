import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Login: undefined;
  Register: undefined;
  Translation: undefined;
  ForgotPassword: undefined;
  Billing: undefined;
  Reframing: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
