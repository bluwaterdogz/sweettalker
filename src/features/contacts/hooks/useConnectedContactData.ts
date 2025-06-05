import { Contact } from "@common/models/contacts/contact";
import { useUser } from "@/features/auth/hooks/useUser";
import { useServices } from "@/services/context";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { Connection } from "@common/models/contacts/connection";
import { QueryOptions } from "@/services/firebase/data/query";
import { useConnectionsMap } from "./useMapConnectionsToContacts";
import { ContactWithConnection } from "../types";

interface UseConactListDataProps {
  connectionsQuery?: QueryOptions;
  getContactsQuery?: (connections: Connection[]) => QueryOptions;
}

interface UseConactListData {
  contacts: ContactWithConnection[];
  connections: Connection[];
  getConnection: (userIds: string[]) => Connection | undefined;
  loading: boolean;
}
export const useConnectedContactData = ({
  connectionsQuery,
  getContactsQuery = (connections: Connection[]) => {
    if (connections.length === 0 || !connections) return {};
    return {
      where: [
        {
          field: "__name__",
          operator: "in",
          value: connections.map((c) => c.userIds).flat(),
        },
      ],
    };
  },
}: UseConactListDataProps): UseConactListData => {
  const { user } = useUser();

  const { contactService, connectionService } = useServices();

  const {
    hasFetched: hasFetchedConnections,
    loading: connectionLoading,
    result: connections = [],
  } = useSubscribeFirestore<Connection[]>((onData, onError) =>
    connectionService.subscribe(onData, onError, {
      query: connectionsQuery || {
        // TODO make permission for this on firebase
        where: [
          {
            field: "userIds",
            operator: "array-contains",
            value: user?.uid || "",
          },
        ],
      },
    })
  );

  const { loading, result: contacts = [] } = useSubscribeFirestore<Contact[]>(
    (onData, onError) =>
      contactService.subscribe(onData, onError, {
        query: getContactsQuery(connections),
      }),
    { enabled: hasFetchedConnections && connections.length > 0 }
  );

  const { getConnection, formattedUsers } = useConnectionsMap({
    connections: connections || [],
    users: contacts,
  });

  return {
    contacts: formattedUsers,
    getConnection,
    connections,
    loading: connectionLoading || loading,
  };
};
