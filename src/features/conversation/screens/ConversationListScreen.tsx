import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { RootStackNavigationProp } from "@/app/navigation/types";
import { useServices } from "@/services/context";
import { ConversationList } from "../components/ConversationList";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Icon } from "@/common/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Conversation } from "@common/models/chat/conversation";
import { PageHeader } from "@/app/layout/PageHeader";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Contact } from "@common/models/contacts/contact";
import { useEffect, useMemo } from "react";
import { optionalWhereIn } from "../utils/optionalWhereIn";
import { Loader } from "@/common/components/Loader";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { useUser } from "@/features/auth/hooks/useUser";
import { auth, firestore } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";

export const ConversationListScreen = () => {
  const { colors } = useTheme();
  const { conversationService, contactService } = useServices();
  const navigation = useAppNavigation();
  const { t } = useTranslation();

  const { loading, result: conversations = [] } = useSubscribeFirestore<
    Conversation[]
  >((d, e) => conversationService.subscribe(d, e));

  const { result: contacts = [], loading: contactsLoading } =
    useSubscribeFirestore<Contact[]>(
      (onData, onError) =>
        contactService.subscribe(onData, onError, {
          // query: {
          //   where: optionalWhereIn(conversations.map((c) => c.userIds).flat()),
          // },
        })
      // { enabled: !loading }
    );
  console.log(contacts);
  const usersMap = useMemo(() => {
    return new Map<string, Contact>(contacts.map((c) => [c.id, c]));
  }, [contacts]);

  const onConversationPress = (id: string) => {
    navigation.navigate("Conversation", { conversationId: id });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <PageHeader title={t("chat.conversations")}>
        <Pressable
          onPress={() => {
            navigation.navigate("ContactList");
          }}
        >
          <Icon icon={faPlus} size={24} color={colors.text.primary} />
        </Pressable>
      </PageHeader>

      <View style={styles.listContainer}>
        {contactsLoading || loading ? (
          <Loader />
        ) : (
          <ConversationList
            usersMap={usersMap}
            conversations={conversations}
            onConversationPress={onConversationPress}
            loading={contactsLoading || loading}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    paddingVertical: 16,
  },
});
