import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { Card } from "@/common/components";
import { Conversation } from "@common/models/conversation";
import { MultiAvatar } from "@/common/components/MultiAvatar/MultiAvatar";

import { useThemeBorders } from "@/common/hooks/useThemeBorders";
import { TruncatedText } from "@/common/components/TruncatedText";
import { Contact } from "@common/models/contacts/contact";
import { UserPrivateConversationDetails } from "@common/models/conversation/user_private_conversation_details";

interface ConversationItemProps {
  conversation: Conversation & Partial<UserPrivateConversationDetails>;
  onPress: (id: string) => void;
  currentUserId?: string;
  users: Contact[];
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
  users,
}) => {
  const { colors } = useTheme();
  const avatarStyle = useThemeBorders();
  return (
    <Card
      key={conversation.id}
      onPress={() => onPress(conversation.id)}
      style={[styles.card]}
    >
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <MultiAvatar
            users={users}
            size={45}
            avatarStyle={avatarStyle}
            badgeNumber={
              conversation.numMessages -
              (conversation.readCount || conversation.numMessages)
            }
          />
        </View>
        <View style={styles.content}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
            {users.map((user) => user.displayName).join(", ")}
          </Text>
          <TruncatedText
            style={[styles.cardSubtitle, { color: colors.text.primary }]}
            text={conversation.lastMessageText || ""}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingVertical: 32,
    padding: 16,
    borderRadius: 12,
    flex: 1,
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 14,
    flexWrap: "wrap",
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
  },
  avatarContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 16,
  },
  content: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
