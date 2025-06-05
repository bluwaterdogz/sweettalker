import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { Icon } from "@/common/components";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useNavigation } from "@react-navigation/native";
import { useServices } from "@/services/context";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Contact } from "@common/models/contacts/contact";
import { useAppDispatch } from "@/store";
import { useAppRoute } from "@/app/navigation/hooks/useAppRoute";

export const ContactDetailScreen = ({
  conversations = [],
  currentUserId = "user",
}: {
  conversations: any[];
  currentUserId: string;
}) => {
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useAppRoute<"ContactDetail">();
  const { contactId } = route.params;
  const { contactService, conversationService } = useServices();
  const dispatch = useAppDispatch();

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

  const handleChatPress = async () => {
    if (!contact) return;

    const existing = findConversationWithContact(contact.id);
    if (existing) {
      (navigation as any).navigate("Conversation", {
        conversationId: existing.id,
      });
    } else {
      const newId = uuidv4();
      const conversation = {
        id: newId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: currentUserId,
        updatedBy: currentUserId,
        userIds: [currentUserId, contact.id],
        options: { color: colors.listItemColors[0] },
        readReceipts: {},
      };
      await conversationService.create(conversation);
      (navigation as any).navigate("Conversation", { conversationId: newId });
    }
  };

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
      <Image source={{ uri: contact.photoURL }} style={styles.avatar} />
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
      <Pressable
        style={[styles.chatButton, { backgroundColor: colors.accent.primary }]}
        onPress={handleChatPress}
      >
        <Icon
          icon={faCommentDots}
          color={colors.background.primary}
          size={20}
        />
        <Text
          style={[styles.chatButtonText, { color: colors.background.primary }]}
        >
          Start Chat
        </Text>
      </Pressable>
      <Pressable
        style={[styles.saveButton, { backgroundColor: colors.neutral[100] }]}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: colors.neutral[400] }]}>
          Save
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 48,
  },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
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
