import { BillingScreen } from "@/features/billing/components/BillingScreen";
import { FirebaseRegisterForm } from "@/features/auth/components/register-form";
import { FirebaseLoginForm } from "@/features/auth/components/login-form";

import { ProfileScreen } from "@/features/profile/components/ProfileScreen";
import { ReframingScreen } from "@/features/reframing/components/ReframingScreen";
import { TranslationScreen } from "@/features/translation/components/TranslationScreen";
import { View } from "react-native";

export const userRoutes = [
  {
    name: "Translation",
    tag: "common.translation",
    component: TranslationScreen,
    options: { title: "Translation" },
  },
  {
    name: "Reframing",
    tag: "common.reframing",
    component: ReframingScreen,
    options: { title: "Reframing" },
  },
  {
    name: "Profile",
    tag: "common.profile",
    component: ProfileScreen,
    options: { title: "Profile" },
  },
  // {
  //   name: "Billing",
  //   component: BillingScreen,
  //   options: { title: "Billing" },
  // },
];

export const publicRoutes = [
  {
    name: "Register",
    tag: "auth.register",
    component: FirebaseRegisterForm,
    options: { title: "Register" },
  },
  {
    name: "Login",
    tag: "auth.login",
    component: FirebaseLoginForm,
    options: { title: "Login" },
  },
  {
    name: "ForgotPassword",
    tag: "auth.forgotPassword",
    component: View, //FirebaseForgotPasswordForm
    options: { title: "Forgot Password" },
  },
];
