import { View, StyleSheet, Pressable } from "react-native";
import { Icon, SearchableList } from "@/common/components";
import { faMessage, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useAppDispatch } from "@/store";
import { useUser } from "@/features/auth/hooks/useUser";
import { useServices } from "@/services/context";
import { addConversation } from "@/features/conversation/store/thunks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContactItem } from "../components/ContactItem";
import { PageHeader } from "../../../app/layout/PageHeader";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Contact } from "@common/models/contacts/contact";
import { Connection } from "@common/models/contacts/connection";
import { useMapConnectionsToContacts } from "../hooks/useMapConnectionsToContacts";
import { optionalWhereIn } from "@/features/conversation/utils/optionalWhereIn";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { ContactItemControls } from "../components/ContactItemControls";
import { ContactWithConnection } from "../types";

export const ContactListScreen = ({}: {
  mode?: "default" | "create-conversation";
}) => {
  const navigation = useAppNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { conversationService } = useServices();
  const [activeUsers, setActiveUser] = useState<ContactWithConnection[]>([]);
  const { contactService, connectionService } = useServices();

  const {
    hasFetched: hasFetchedConnections,
    loading: connectionLoading,
    result: connections = [],
  } = useSubscribeFirestore<Connection[]>((onData, onError) =>
    connectionService.subscribe(onData, onError, {
      query: {
        where: [{ field: "status", operator: "==", value: "accepted" }],
      },
    })
  );

  const { loading, result: contacts = [] } = useSubscribeFirestore<Contact[]>(
    (onData, onError) =>
      contactService.subscribe(onData, onError, {
        query: {
          where: optionalWhereIn(connections.map((c) => c.userIds).flat()),
        },
      }),
    {
      enabled: hasFetchedConnections && connections.length > 0,
      deps: [connections],
    }
  );

  const { contactsWithConnections } = useMapConnectionsToContacts({
    connections: connections || [],
    users: contacts,
  });

  const goToChat = useCallback(
    async (contact: ContactWithConnection) => {
      let conversationId = await conversationService.getConversationId(
        contact.id
      );
      if (!conversationId) {
        await dispatch(
          addConversation({
            userIds: [user?.uid!, contact.id],
          })
        );
        conversationId = await conversationService.getConversationId(
          contact.id
        );
      }
      if (conversationId) {
        navigation.navigate("Conversation", {
          conversationId: conversationId,
        });
      } else {
        console.error("Conversation not created");
      }
    },
    [dispatch, navigation, user?.uid, conversationService]
  );

  const toggleActiveUser = useCallback(
    (contact: ContactWithConnection) => {
      setActiveUser([contact]);
    },
    [setActiveUser]
  );

  const activeUserIdMap = useMemo(() => {
    return (
      activeUsers?.reduce(
        (acc, user) => {
          acc[user.id] = true;
          return acc;
        },
        {} as Record<string, boolean>
      ) || {}
    );
  }, [activeUsers]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <PageHeader title={t("contacts.contacts")}>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("ContactSearch")}
        >
          <Icon icon={faPlus} size={24} color={colors.text.primary} />
        </Pressable>

        {activeUsers.length > 0 && (
          <Pressable
            style={styles.addButton}
            onPress={() => goToChat(activeUsers[0])}
          >
            <Icon icon={faMessage} size={24} color={colors.text.primary} />
          </Pressable>
        )}
      </PageHeader>
      <SearchableList
        data={contactsWithConnections}
        searchKeys={["displayName", "email"]}
        renderItem={(item) => {
          return (
            <ContactItem
              onLongPress={() => toggleActiveUser(item)}
              key={item.id}
              contact={item}
              isActive={activeUserIdMap[item.id]}
              onPress={() =>
                navigation.navigate("ContactDetail", { contactId: item.id })
              }
            >
              <ContactItemControls contact={item} />
            </ContactItem>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  addButton: { backgroundColor: "transparent" },
  separator: { height: 1, marginLeft: 94 },
});
