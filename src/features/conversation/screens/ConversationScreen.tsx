import { useCallback, useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useServices } from "@/services/context";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useUser } from "@/features/auth/hooks/useUser";
import { MessageItem } from "../components/MessageItem";
import { Avatar } from "@/common/components/Avatar";
import { MultiAvatar } from "@/common/components/MultiAvatar/MultiAvatar";
import { getRandomUser } from "@/features/auth/mocks";
import { Conversation, Message } from "@common/models/chat";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { useThemeBorders } from "@/features/interpretation/hooks/useThemeBorders";
import { ConversationControls } from "../components/ConversationControls";
import { useAppRoute } from "@/app/navigation/hooks/useAppRoute";
import { Contact } from "@common/models/contacts/contact";
import { optionalWhereIn } from "../utils/optionalWhereIn";
import { updateConversation } from "../store/thunks";
import { useAppDispatch } from "@/store";
import { Loader } from "@/common/components/Loader";

export function ConversationScreen() {
  const { user } = useUser();
  const { colors } = useTheme();
  const { conversationService, messageService, contactService } = useServices();

  const route = useAppRoute<"Conversation">();
  const { conversationId } = route.params;
  const dispatch = useAppDispatch();

  const avatarStyle = useThemeBorders();
  const { loading, result: conversation } = useSubscribeFirestore<Conversation>(
    (onData, onError) =>
      conversationService.subscribeSingle(
        onData,
        onError as any,
        conversationId
      )
  );

  const updateReadStatus = useCallback(async () => {
    if (!conversation) return;
    dispatch(
      updateConversation({
        id: conversationId,
        unreadCounts: {
          ...conversation.unreadCounts,
          [user!.uid]: 0,
        },
      })
    );
  }, [conversation, conversationId, conversationService]);

  useEffect(() => {
    updateReadStatus();
  }, [conversationId]);

  const { result: contacts = [] } = useSubscribeFirestore<Contact[]>(
    (onData, onError) =>
      contactService.subscribe(onData, onError, {
        query: {
          // TODO, may overwrite default query
          where: optionalWhereIn(conversation?.userIds),
        },
      }),
    { enabled: loading }
  );

  const usersMap = useMemo(() => {
    return new Map(contacts.map((c) => [c.id, c]));
  }, [contacts]);

  const { loading: messageLoading, result: messages = [] } =
    useSubscribeFirestore<Message[]>((onData, onError) =>
      messageService.subscribe(onData, onError, {
        conversationId,
        query: { orderBy: [{ field: "createdAt", direction: "asc" }] },
      })
    );

  const users =
    conversation?.userIds.map((id) => {
      const contact = usersMap.get(id);
      return contact || getRandomUser();
    }) || [];

  const otherUsers = users.filter(({ id }) => id !== user?.uid) || [];

  const userMap = useMemo(() => {
    return new Map(users.map((c) => [c.id, c]));
  }, [users]);

  if (loading) {
    return <Loader />;
  }
  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: colors.text.primary }]}>
          <Avatar photoURL={user?.photoURL} size={45} style={avatarStyle} />
        </Text>
        {otherUsers.length > 0 && (
          <Text style={[styles.headerText, { color: colors.text.primary }]}>
            <MultiAvatar users={otherUsers} avatarStyle={avatarStyle} />
          </Text>
        )}
      </View>

      <View style={styles.messagesContainer}>
        {messages.map((msg, index) => {
          return (
            <MessageItem
              key={msg.id}
              message={msg}
              showUser={msg.createdBy !== messages[index - 1]?.createdBy}
              isUsersMessage={msg.createdBy === user?.uid}
              user={userMap.get(msg.createdBy!) || getRandomUser()}
            />
          );
        })}
      </View>
      <ConversationControls
        conversation={conversation!}
        userMap={userMap}
        messages={messages}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
    gap: 8,
  },
});
