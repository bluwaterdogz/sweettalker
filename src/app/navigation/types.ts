import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Profile: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Translation: {
    conversationId?: string;
    messageId?: string;
    initialMessage?: string;
  };
  Conversation: {
    conversationId: string;
    messageId?: string;
    initialMessage?: string;
  };
  Conversations: undefined;
  CheckIn: undefined;
  ContactList: undefined;
  ContactDetail: { contactId: string };
  ContactSearch: undefined;
  PendingConnections: undefined;
};

export type RootStackNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
