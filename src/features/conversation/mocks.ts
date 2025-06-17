import { Conversation, Message } from "@common/models/conversation";
import { Timestamp } from "firebase/firestore";
import { getRandomUser } from "../auth/mocks";
import { colors } from "@/common/theme/colors";
import { InterpretationType } from "@common/models/interpretation/interpretation";

// Create 10 mock conversations
export const mockConversations: Conversation[] = Array.from({ length: 10 }).map(
  (_, convoIndex) => {
    const convoId = `conv_${convoIndex}`;
    const participants = [
      ...new Set([
        getRandomUser(),
        getRandomUser(),
        ...(Math.random() > 0.5 ? [getRandomUser()] : []),
      ]),
    ].slice(0, 3); // max 3 participants

    const messageCount = Math.floor(Math.random() * 21); // 0–20 messages
    const messages: Message[] = Array.from({ length: messageCount }).map(
      (_, msgIndex) => {
        const author = getRandomUser(participants.map((x) => x.uid));
        const partner = getRandomUser(
          participants.map((x) => x.uid).filter((p) => p !== author.uid)
        );
        const messageId = Math.random().toString(36).substring(2, 15);

        return {
          id: messageId,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          createdBy: author.uid,
          updatedBy: null,
          conversationId: convoId,
          authorId: author.uid,
          partnerId: partner.uid,
          content: `Mock message ${msgIndex + 1} from ${
            author.displayName
          } to ${partner.displayName}`,
          activeInterpretationId: "", // To be filled later
          interpretations: [],
          userMessage: {
            id: messageId,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            createdBy: author.uid,
            updatedBy: null,
            text: `Mock message ${msgIndex + 1} from ${author.displayName} to ${
              partner.displayName
            }`,
            description: "Original user message",
            type: InterpretationType.USER_MESSAGE,
          },
        };
      }
    );

    return {
      id: convoId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      createdBy: participants[0].uid,
      updatedBy: participants[0].uid,
      userId: participants[0].uid,
      partners: participants.slice(1),
      messages,
      options: {
        color:
          colors.light.listItemColors[
            Math.floor(Math.random() * colors.light.listItemColors.length)
          ],
      },
    };
  }
);
