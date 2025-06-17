import { useState } from "react";
import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { ContactList } from "../components/ContactList";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useServices } from "@/services/context";
import { usePromise } from "@/common/hooks/usePromise";
import { useUser } from "@/features/auth/hooks/useUser";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Connection } from "@common/models/contacts/connection";
import { useMapConnectionsToContacts } from "../hooks/useMapConnectionsToContacts";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { PageHeader } from "@/app/layout/PageHeader";
import { Icon } from "@/common/components/Icon";
import { ContactItemControls } from "../components/ContactItemControls";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";

export const ContactSearchScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const { user } = useUser();
  const { contactService, connectionService } = useServices();
  const navigation = useAppNavigation();

  const { data: users = [] } = usePromise(
    async () => {
      if (search.length < 3) return [];
      return await contactService.searchUsers(search);
    },
    [],
    [search],
    { throttleMs: 3000 }
  );

  // Subscribe to connections
  const { result: connections = [] } = useSubscribeFirestore<Connection[]>(
    (onData, onError) => connectionService.subscribe(onData, onError)
  );

  const { contactsWithConnections } = useMapConnectionsToContacts({
    connections: connections || [],
    users,
  });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <PageHeader title={t("common.search")}>
        <Pressable onPress={() => navigation.navigate("ContactList")}>
          <Icon icon={faUsers} size={24} color={colors.text.primary} />
        </Pressable>
      </PageHeader>
      <ContactList
        users={contactsWithConnections}
        searchValue={search}
        setSearchValue={setSearch}
        renderItemControls={(contact) => {
          return <ContactItemControls contact={contact} />;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 32,
    marginLeft: 24,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
});
