import { useCallback, useEffect, useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useServices } from "@/services/context";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useUser } from "@/features/auth/hooks/useUser";
import { Avatar } from "@/common/components/Avatar";
import { MultiAvatar } from "@/common/components/MultiAvatar/MultiAvatar";
import { Conversation, Message } from "@common/models/conversation";
import { useSubscribeFirestore } from "@/services/firebase/hooks/useSubscribeFirestore";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";
import { ConversationControls } from "../components/ConversationControls";
import { useAppRoute } from "@/app/navigation/hooks/useAppRoute";
import { Contact } from "@common/models/contacts/contact";
import { optionalWhereIn } from "../utils/optionalWhereIn";
import { updateUserPrivateConversationDetails } from "../store/thunks";
import { useAppDispatch } from "@/store";
import { Loader } from "@/common/components/Loader";

import { ConversationUserDetails } from "@common/models/conversation/conversation_user_details";
import { MessageList } from "../components/MessageList";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";

export function ConversationScreen() {
  const { user } = useUser();
  const { colors } = useTheme();
  const {
    conversationService,
    messageService,
    contactService,
    conversationUserDetailService,
  } = useServices();

  const route = useAppRoute<"Conversation">();
  const { conversationId, initialMessage } = route.params;
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const avatarStyle = useThemeBorders();

  const { loading, result: conversation } = useSubscribeFirestore<Conversation>(
    (onData, onError) =>
      conversationService.subscribeSingle(
        onData,
        onError as any,
        conversationId
      )
  );

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

  const { result: conversationUserDetails = [] } = useSubscribeFirestore<
    ConversationUserDetails[]
  >((onData, onError) =>
    conversationUserDetailService.subscribeCustomId(onData, onError, {
      conversationId,
      userId: user!.uid,
    })
  );

  const { result: messages = [] } = useSubscribeFirestore<Message[]>(
    (onData, onError) =>
      messageService.subscribe(onData, onError, {
        conversationId,
        query: { orderBy: [{ field: "createdAt", direction: "asc" }] },
      })
  );

  const updateReadStatus = useCallback(async () => {
    if (!conversation) return;
    dispatch(
      updateUserPrivateConversationDetails({
        conversationId,
        readCount: conversation.numMessages,
      })
    );
  }, [conversation, conversationId, conversationService]);

  useEffect(() => {
    updateReadStatus();
  }, [conversation?.numMessages]);

  const users = useMemo<Contact[]>(() => {
    const allUsersMap = new Map(contacts.map((c) => [c.id, c]));
    const users =
      conversation?.userIds.map((id) => {
        return allUsersMap.get(id);
      }) || [];
    return users as Contact[];
  }, [contacts]);

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
      <View
        style={[
          styles.header,
          {
            borderBottomWidth: 1,
            borderColor: colors.neutral[300],
          },
        ]}
      >
        <View>
          <Avatar
            photoURL={user?.photoURL}
            size={45}
            style={avatarStyle}
            // iconProportion={0.6}
          />
        </View>
        {otherUsers.length > 0 && (
          <View>
            <MultiAvatar
              onUserPress={(user) => {
                navigation.navigate("ContactDetail", { contactId: user.id });
              }}
              size={45}
              users={otherUsers}
              avatarStyle={avatarStyle}
            />
          </View>
        )}
      </View>

      <View style={styles.messagesContainer}>
        <MessageList
          messages={messages}
          userMap={userMap}
          currentUserId={user?.uid}
          scrollToBottom={true}
        />
      </View>
      <View
        style={[
          styles.controlsContainer,
          {
            borderTopWidth: 1,
            borderColor: colors.neutral[300],
          },
        ]}
      >
        <ConversationControls
          conversation={conversation!}
          userMap={userMap}
          messages={messages}
          conversationUserDetails={conversationUserDetails}
          initialMessage={initialMessage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 8,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
  },
  controlsContainer: {
    paddingHorizontal: 16,
  },
});
