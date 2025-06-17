import { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Button, Icon } from "@/common/components";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useServices } from "@/services/context";
import { Contact } from "@common/models/contacts/contact";
import { useAppDispatch } from "@/store";
import { useAppRoute } from "@/app/navigation/hooks/useAppRoute";
import { addConversation } from "@/features/conversation/store/thunks";
import { useUser } from "@/features/auth/hooks/useUser";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { Avatar } from "@/common/components/Avatar";
import { useThemeBorders } from "@/common/hooks/useThemeBorders";

export const ContactDetailScreen = ({
  conversations = [],
  currentUserId = "user",
}: {
  conversations: any[];
  currentUserId: string;
}) => {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const { colors } = useTheme();
  const navigation = useAppNavigation();
  const route = useAppRoute<"ContactDetail">();
  const { contactId } = route.params;
  const { user } = useUser();
  const { contactService, conversationService } = useServices();
  const dispatch = useAppDispatch();
  const avatarStyle = useThemeBorders();
  useEffect(() => {
    const loadContact = async () => {
      const loadedContact = await contactService.get(contactId);
      // if (loadedContact) {
      setContact(loadedContact);
      //   setNickname(loadedContact.nickname || "");
      //   setFavorite(loadedContact.isFavorite);
      //   setBlocked(loadedContact.isBlocked);
      //   setMuted(loadedContact.isMuted);
      //   setArchived(loadedContact.isArchived);
      //  }
    };
    loadContact();
  }, [contactId]);

  // Find conversation with this contact
  const findConversationWithContact = (contactId: string) => {
    return conversations.find(
      (conv) =>
        conv.userIds.length === 2 &&
        conv.userIds.includes(currentUserId) &&
        conv.userIds.includes(contactId)
    );
  };

  const goToChat = useCallback(
    async (contact: Contact) => {
      let conversationId = await conversationService.getConversationId(
        contact.id
      );
      if (!conversationId) {
        await dispatch(
          addConversation({
            userIds: [user?.uid!, contact.id],
          })
        );
        conversationId = await conversationService.getConversationId(
          contact.id
        );
      }
      if (conversationId) {
        navigation.navigate("Conversation", {
          conversationId: conversationId,
        });
      } else {
        console.error("Conversation not created");
      }
    },
    [dispatch, navigation, user?.uid, conversationService]
  );

  const handleSave = async () => {
    if (!contact) return;

    // await contactService.updateContact(contact.uid, {
    //   nickname,
    //   isBlocked: blocked,
    //   isMuted: muted,
    //   isArchived: archived,
    // });
  };

  if (!contact) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background.primary },
        ]}
      >
        <Text style={[styles.name, { color: colors.text.primary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <Avatar
        size={220}
        photoURL={contact.photoURL!}
        style={[styles.avatar, avatarStyle]}
      />
      <Text style={[styles.name, { color: colors.text.primary }]}>
        {contact.displayName}
      </Text>
      {/* <View style={styles.actions}>
        <Pressable
          style={[
            styles.action,
            favorite && styles.selectedAction,
            favorite && {
              backgroundColor: colors.secondaryAccent.secondary,
              borderColor: colors.secondaryAccent.primary,
            },
          ]}
          onPress={() => setFavorite((v) => !v)}
        >
          <Icon
            icon={faStar}
            color={colors.secondaryAccent.primary}
            size={20}
          />
          <Text style={[styles.actionText, { color: colors.text.primary }]}>
            Favorite
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.action,
            blocked && styles.selectedAction,
            blocked && {
              backgroundColor: colors.error.secondary,
              borderColor: colors.error.primary,
            },
          ]}
          onPress={() => setBlocked((v) => !v)}
        >
          <Icon icon={faBan} color={colors.error.primary} size={20} />
          <Text style={[styles.actionText, { color: colors.text.primary }]}>
            Block
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.action,
            muted && styles.selectedAction,
            muted && {
              backgroundColor: colors.neutral[100],
              borderColor: colors.neutral[400],
            },
          ]}
          onPress={() => setMuted((v) => !v)}
        >
          <Icon icon={faBellSlash} color={colors.text.secondary} size={20} />
          <Text style={[styles.actionText, { color: colors.text.primary }]}>
            Mute
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.action,
            archived && styles.selectedAction,
            archived && {
              backgroundColor: colors.neutral[100],
              borderColor: colors.neutral[400],
            },
          ]}
          onPress={() => setArchived((v) => !v)}
        >
          <Icon icon={faArchive} color={colors.text.secondary} size={20} />
          <Text style={[styles.actionText, { color: colors.text.primary }]}>
            Archive
          </Text>
        </Pressable>
      </View>
      <TextInput
        style={[
          styles.nicknameInput,
          {
            color: colors.text.secondary,
            borderBottomColor: colors.neutral[200],
          },
        ]}
        placeholder="Add nickname"
        value={nickname}
        onChangeText={setNickname}
        placeholderTextColor={colors.neutral[400]}
      />
       */}
      <Button onPress={() => goToChat(contact)}>
        <Icon icon={faCommentDots} color={colors.text.primary} size={20} />
        <Text style={[styles.chatButtonText, { color: colors.text.primary }]}>
          Start Chat
        </Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  avatar: {
    borderRadius: 60,
    marginBottom: 16,
  },
  name: { fontSize: 28, fontWeight: "bold", marginBottom: 6 },
  chatButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 40,
    marginTop: 12,
    marginBottom: 12,
  },
  chatButtonText: { fontSize: 20, fontWeight: "bold", marginLeft: 12 },
  saveButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 80,
    alignItems: "center",
    marginTop: 12,
  },
  saveButtonText: { fontSize: 20, fontWeight: "bold" },
});
