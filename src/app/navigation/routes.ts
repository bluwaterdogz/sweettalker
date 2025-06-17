import { BillingScreen } from "@/features/billing/components/BillingScreen";
import { FirebaseRegisterForm } from "@/features/auth/components/register-form";
import { FirebaseLoginForm } from "@/features/auth/components/login-form";

import { ProfileScreen } from "@/features/profile/screens/ProfileScreen";
// import { ReframingScreen } from "@/features/reframing/components/ReframingScreen";
import { TranslationScreen } from "@/features/translation/screens/TranslationScreen";
import { View } from "react-native";
import { CheckInScreen } from "@/features/check-in/screens/CheckInScreen";
import { ConversationScreen } from "@/features/conversation/screens/ConversationScreen";
import { ConversationListScreen } from "@/features/conversation/screens/ConversationListScreen";
import { ContactListScreen } from "@/features/contacts/screens/ContactListScreen";
import { ContactDetailScreen } from "@/features/contacts/screens/ContactDetailScreen";
import { ContactSearchScreen } from "@/features/contacts/screens/ContactSearchScreen";
import { PendingContactsList } from "@/features/contacts/screens/PendingContactsListScreen";
import { RootStackParamList } from "./types";
import { withErrorBoundary } from "@/common/components/ErrorBoundary/WithErrorBoundary";

export const DEFAULT_SCREEN = "Translation";
// export const DEFAULT_SCREEN = "SplashController";
interface Route {
  name: keyof RootStackParamList;
  tag: string;
  component: React.ComponentType<any>;
  options?: { title: string };
  excludeFromNav?: boolean;
}

export const userRoutes: Route[] = [
  {
    name: "Conversations",
    tag: "common.conversationList",
    component: withErrorBoundary(ConversationListScreen),
    options: { title: "Conversations" },
  },
  {
    name: "Translation",
    tag: "common.translation",
    component: withErrorBoundary(TranslationScreen),
    options: { title: "Translation" },
  },
  {
    name: "CheckIn",
    tag: "common.checkIn",
    component: withErrorBoundary(CheckInScreen),
    options: { title: "Check In" },
  },

  {
    name: "ContactList",
    tag: "common.contactList",
    component: withErrorBoundary(ContactListScreen),
    options: { title: "Contacts" },
  },

  {
    name: "Profile",
    tag: "common.profile",
    component: withErrorBoundary(ProfileScreen),
    excludeFromNav: true,
    options: { title: "Profile" },
  },
  {
    name: "ContactSearch",
    tag: "common.contactSearch",
    component: withErrorBoundary(ContactSearchScreen),
    excludeFromNav: true,
    options: { title: "Search Users" },
  },
  {
    name: "PendingConnections",
    tag: "common.pendingConnections",
    component: withErrorBoundary(PendingContactsList),
    excludeFromNav: true,
    options: { title: "Pending Contacts" },
  },
  {
    name: "ContactDetail",
    tag: "common.contactDetail",
    component: withErrorBoundary(ContactDetailScreen),
    options: { title: "Connection" },
    excludeFromNav: true,
  },

  {
    name: "Conversation",
    tag: "common.conversation",
    component: withErrorBoundary(ConversationScreen),
    excludeFromNav: true,
    options: { title: "Conversation" },
  },

  // {
  //   name: "Billing",
  //   component: BillingScreen,
  //   options: { title: "Billing" },
  // },
];

export const publicRoutes: Route[] = [
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
