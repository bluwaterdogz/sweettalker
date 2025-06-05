import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Loader } from "@/common/components";
import { Conversation } from "@common/models/chat";
import { EmptyStateMessage } from "@/common/components/EmptyStateMessage";
import { ConversationItem } from "./ConversationItem";
import { useUser } from "@/features/auth/hooks/useUser";
import { Contact } from "@common/models/contacts/contact";

interface ConversationListProps {
  conversations: Conversation[];
  onConversationPress: (id: string) => void;
  loading?: boolean;
  usersMap: Map<string, Contact>;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onConversationPress,
  loading,
  usersMap,
}) => {
  const { colors } = useTheme();
  const { user } = useUser();
  return (
    <View style={{ flex: 1 }}>
      {loading && <Loader />}
      {conversations.length > 0 && (
        <View
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <FlatList
            data={conversations}
            style={{
              width: "100%",
            }}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    width: "100%",
                    borderBottomWidth: 1,
                    borderBottomColor: colors.neutral[200],
                  }}
                >
                  <ConversationItem
                    conversation={item}
                    onPress={() => onConversationPress(item.id)}
                    users={item.userIds
                      .filter((id) => id !== user?.uid)
                      .map((id) => usersMap.get(id))
                      .filter((x) => x != null)}
                  />
                </View>
              );
            }}
          />
        </View>
      )}

      {conversations.length === 0 && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <EmptyStateMessage />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({});
