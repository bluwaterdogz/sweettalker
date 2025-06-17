import { View, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useServices } from "@/services/context";
import { ConversationList } from "../components/ConversationList";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Icon } from "@/common/components";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Conversation } from "@common/models/conversation/conversation";
import { PageHeader } from "@/app/layout/PageHeader";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { Contact } from "@common/models/contacts/contact";
import { useMemo } from "react";
import { Loader } from "@/common/components/Loader";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { useUser } from "@/features/auth/hooks/useUser";
import { UserPrivateConversationDetails } from "@common/models/conversation/user_private_conversation_details";
import { optionalWhereIn } from "../utils/optionalWhereIn";

export const ConversationListScreen = () => {
  const { colors } = useTheme();
  const {
    conversationService,
    contactService,
    userPrivateConversationDetailService,
  } = useServices();
  const navigation = useAppNavigation();
  const { t } = useTranslation();
  const { user } = useUser();

  const { loading, result: conversations = [] } = useSubscribeFirestore<
    Conversation[]
  >((d, e) => conversationService.subscribe(d, e));

  const { result: contacts = [], loading: contactsLoading } =
    useSubscribeFirestore<Contact[]>(
      (onData, onError) =>
        contactService.subscribe(onData, onError, {
          query: {
            where: optionalWhereIn(conversations.map((c) => c.userIds).flat()),
          },
        }),
      { enabled: !loading }
    );

  const {
    result: conversationDetails = [],
    loading: conversationDetailsLoading,
  } = useSubscribeFirestore<UserPrivateConversationDetails[]>(
    (onData, onError) =>
      userPrivateConversationDetailService.subscribe(
        onData,
        onError || (() => {})
      )
  );

  const usersMap = useMemo(() => {
    return new Map<string, Contact>(contacts.map((c) => [c.id, c]));
  }, [contacts]);

  const onConversationPress = (id: string) => {
    navigation.navigate("Conversation", { conversationId: id });
  };

  const conversationDetailsMap = useMemo(() => {
    return new Map<string, UserPrivateConversationDetails>(
      conversationDetails.map((c) => [c.id, c])
    );
  }, [conversationDetails]);

  const formattedConversations = useMemo(() => {
    return conversations.map((c) => ({
      ...c,
      readCount: conversationDetailsMap.get(c.id)?.readCount || c.numMessages,
    }));
  }, [conversations, conversationDetailsMap]);

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
            conversations={formattedConversations}
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
  },
});
