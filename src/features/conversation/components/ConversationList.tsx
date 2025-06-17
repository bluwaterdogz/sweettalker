import React from "react";
import { View, StyleSheet } from "react-native";
import { List } from "@/common/components/List";
import { Conversation } from "@common/models/conversation";
import { ConversationItem } from "./ConversationItem";
import { useUser } from "@/features/auth/hooks/useUser";
import { Contact } from "@common/models/contacts/contact";
import { UserPrivateConversationDetails } from "@common/models/conversation/user_private_conversation_details";
import { useTheme } from "@/common/theme/hooks/useTheme";

interface ConversationListProps {
  conversations: (Conversation & Partial<UserPrivateConversationDetails>)[];
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

  const renderConversation = (
    item: Conversation & Partial<UserPrivateConversationDetails>
  ) => {
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
          users={
            item.userIds
              .filter((id: string) => id !== user?.uid)
              .map((id: string) => usersMap.get(id))
              .filter((x) => x != null) as Contact[]
          }
        />
      </View>
    );
  };

  return (
    <List
      data={conversations}
      renderItem={renderConversation}
      loading={loading}
      keyExtractor={(item) => item.id}
      showItemSeparator={false} // We handle separators manually in renderItem
      style={{ flex: 1 }}
    />
  );
};

const styles = StyleSheet.create({});
