import React from "react";
import { StyleSheet } from "react-native";
import { List } from "@/common/components/List";
import { MessageItem } from "./MessageItem";
import { Message } from "@common/models/conversation/message";
import { Contact } from "@common/models/contacts/contact";
import { ErrorBoundary } from "@/common/components/ErrorBoundary";

interface MessageListProps {
  messages: Message[];
  userMap: Map<string, Contact>;
  currentUserId?: string;
  scrollToBottom?: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  userMap,
  currentUserId,
  scrollToBottom = true,
}) => {
  const renderMessage = (msg: Message, index: number) => (
    <ErrorBoundary
      fallback={
        <MessageItem
          message={
            {
              id: "error",
              createdAt: new Date(),
              createdBy: "error",
              text: "Error loading message",
            } as any as Message
          }
          user={null}
        />
      }
    >
      <MessageItem
        message={msg}
        showUser={msg.createdBy !== messages[index - 1]?.createdBy}
        isUsersMessage={msg.createdBy === currentUserId}
        user={userMap.get(msg.createdBy!)!}
      />
    </ErrorBoundary>
  );

  const keyExtractor = (msg: Message) => msg.id;

  return (
    <List
      data={messages}
      renderItem={renderMessage}
      keyExtractor={keyExtractor}
      scrollToBottom={scrollToBottom}
      contentContainerStyle={styles.contentContainer}
      style={styles.container}
      fadeTop={true}
      fadeBottom={true}
      fadeSize={20}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
});
