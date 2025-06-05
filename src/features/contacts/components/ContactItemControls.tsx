import { Button } from "@/common/components/Button";
import { Contact } from "@common/models/contacts/contact";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { createConnection, updateConnection } from "../store/thunks";
import { deleteConnection } from "../store/thunks";
import { useAppDispatch, useAppSelector } from "@/store";
import { useUser } from "@/features/auth/hooks/useUser";
import { addConversation } from "@/features/conversation/store/thunks";
import { useServices } from "@/services/context";
import { useAppNavigation } from "@/app/navigation/hooks/useAppNavigation";
import { ContactWithConnection } from "../types";
import { updateSettings } from "@/features/profile/store/thunks";

interface ContactItemControlsProps {
  contact: ContactWithConnection;
}
export const ContactItemControls = ({ contact }: ContactItemControlsProps) => {
  const { t } = useTranslation();
  const navigation = useAppNavigation();
  const { user } = useUser();
  const dispatch = useAppDispatch();
  const { blockedUsers = [] } = useAppSelector((state) => state.settings);
  const { conversationService } = useServices();

  const onCreateConnection = (contact: ContactWithConnection) => {
    const connection = contact.connection;
    if (connection && connection.status == null) {
      dispatch(
        createConnection({
          requesterId: user!.uid,
          receiverId: contact.id,
        })
      );
    }
  };

  const acceptConnection = (contact: ContactWithConnection) => {
    const connection = contact.connection;
    if (connection && connection.status === "pending") {
      dispatch(
        updateConnection({
          id: connection.id,
          data: { status: "accepted" },
        })
      );
    }
  };

  const goToChat = async (contact: ContactWithConnection) => {
    let conversationId = await conversationService.getConversationId(
      contact.id
    );
    if (!conversationId) {
      await dispatch(
        addConversation({
          userIds: [user?.uid!, contact.id],
        })
      );
      conversationId = await conversationService.getConversationId(contact.id);
    }

    navigation.navigate("Conversation", {
      conversationId: conversationId,
    });
  };

  const handleBlockUser = (contact: ContactWithConnection) => {
    dispatch(
      updateSettings({
        blockedUsers: [...blockedUsers, contact.id],
      })
    );
  };

  const handleCancelConnection = (contact: Contact) => {
    if (contact.connection?.id != null) {
      dispatch(deleteConnection(contact.connection?.id));
    }
  };
  const isPending = contact.connection?.status === "pending";
  const isRequester = contact.connection?.requesterId === user?.uid;
  const isAccepted = contact.connection?.status === "accepted";
  const isUnconnected = !contact.connection?.status;

  return (
    <>
      <Button title="Block" onPress={() => handleBlockUser(contact)} />

      {isPending && isRequester && (
        <Button
          title={t("common.cancel")}
          onPress={() => handleCancelConnection(contact)}
        />
      )}

      {isPending && !isRequester && (
        <Button title="Accept" onPress={() => acceptConnection(contact)} />
      )}

      {isAccepted && <Button title="Chat" onPress={() => goToChat(contact)} />}

      {isUnconnected && (
        <Button
          title={t("contacts.connect")}
          onPress={() => onCreateConnection(contact)}
        />
      )}
    </>
  );
};
