import { useUser } from "@/features/auth/hooks/useUser";
import { Connection } from "@common/models/contacts/connection";
import { Contact } from "@common/models/contacts/contact";
import { useMemo } from "react";
interface UseConnectionsMapProps {
  connections: Connection[];
  users: Contact[];
}

interface UseConnectionsMapResult {
  contactsWithConnections: (Contact & { connection?: Connection })[];
  connectionMap: Record<string, Connection>;
  getConnection: (userIds: string[]) => Connection | undefined;
}

export const useMapConnectionsToContacts = ({
  connections = [],
  users = [],
}: UseConnectionsMapProps): UseConnectionsMapResult => {
  const { user } = useUser();
  const connectionMapKey = (ids: string[]) => ids.sort().join(",");

  const connectionMap = useMemo(() => {
    return (
      connections?.reduce(
        (acc, c) => {
          acc[connectionMapKey(c.userIds)] = c;
          return acc;
        },
        {} as Record<string, Connection>
      ) || {}
    );
  }, [connections]);
  const getConnection = (userIds: string[]) => {
    return connectionMap[connectionMapKey(userIds)];
  };

  const contactsWithConnections = useMemo(() => {
    return users
      .filter((contact) => contact.id !== user!.uid)
      .map((contact) => {
        const connection = getConnection([user!.uid, contact.id]);
        return {
          ...contact,
          ...(connection ? { connection } : {}),
        };
      });
  }, [users, getConnection]);

  return { contactsWithConnections, connectionMap, getConnection };
};
