import { useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Button } from "@/common/components/Button";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useUser } from "@/features/auth/hooks/useUser";
import { useAppDispatch } from "@/store";
import { deleteConnection, updateConnection } from "../store/thunks";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "../../../app/layout/PageHeader";
import { Icon } from "@/common/components/Icon";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { ContactItemControls } from "../components/ContactItemControls";
import { ContactList } from "../components/ContactList";
import { Contact } from "@common/models/contacts/contact";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Connection } from "@common/models/contacts/connection";
import { useServices } from "@/services/context";
import { useMapConnectionsToContacts } from "../hooks/useMapConnectionsToContacts";

export const PendingContactsList = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const { connectionService, contactService } = useServices();

  const {
    hasFetched: hasFetchedConnections,
    loading: connectionLoading,
    result: connections = [],
  } = useSubscribeFirestore<Connection[]>((onData, onError) =>
    connectionService.subscribe(onData, onError, {
      query: {
        where: [
          {
            field: "status",
            operator: "==",
            value: "pending",
          },
          {
            field: "userIds",
            operator: "array-contains",
            value: user?.uid,
          },
        ],
      },
    })
  );

  const { loading, result: contacts = [] } = useSubscribeFirestore<Contact[]>(
    (onData, onError) =>
      contactService.subscribe(onData, onError, {
        query: {
          where: [
            {
              field: "__name__",
              operator: "in",
              value: connections.map((c) => c.userIds).flat(),
            },
          ],
        },
      }),
    { enabled: hasFetchedConnections && connections.length > 0 }
  );

  const { contactsWithConnections } = useMapConnectionsToContacts({
    connections: connections || [],
    users: contacts,
  });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <PageHeader title={t("contacts.pendingConnections")}>
        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("ContactSearch")}
        >
          <Icon icon={faPlus} size={24} color={colors.text.primary} />
        </Pressable>

        <Pressable
          style={styles.addButton}
          onPress={() => navigation.navigate("ContactList")}
        >
          <Icon icon={faUsers} size={24} color={colors.text.primary} />
        </Pressable>
      </PageHeader>

      {!contacts?.length ? (
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: colors.background.primary },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            {t("contacts.noPendingRequests")}
          </Text>
        </View>
      ) : (
        <ContactList
          users={contactsWithConnections}
          renderItemControls={(contact) => {
            return <ContactItemControls contact={contact} />;
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  addButton: { backgroundColor: "transparent" },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
});
