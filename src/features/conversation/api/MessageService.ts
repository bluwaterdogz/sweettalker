import { Message, MessageDTO } from "@common/models/chat/message";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { InterpretationClient } from "@/features/interpretation/api/InterpretationClient";
import { Model } from "@common/types";
import { InterpretationService } from "@/features/interpretation/api/InterpretationService";
import { v4 as uuidv4 } from "uuid";
import { Timestamp } from "firebase/firestore";
import { ConversationService } from "./ConversationService";

import { MessageMapper } from "@common/models/chat/mappers";
import { BaseService } from "@/services/base/BaseService";
import { AuthService } from "@/features/auth/api/service";
import { Conversation } from "@common/models/chat/conversation";
import { User } from "firebase/auth";

interface MessageServiceOptions {
  conversationId: string;
}

export class MessageService extends BaseService<
  Message,
  MessageDTO,
  MessageServiceOptions
> {
  protected firestoreTag: FirestoreCollections.MESSAGES =
    FirestoreCollections.MESSAGES;
  protected mapper = MessageMapper.map;

  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly conversationService: ConversationService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService);
  }

  getPathPrefix({ conversationId }: MessageServiceOptions): string {
    return `conversations/${conversationId}/${this.firestoreTag}`;
  }

  async updateConversationWithMessageData(
    conversation: Conversation,
    user: User,
    input: string
  ) {
    const updatedUnreadCounts = { ...conversation.unreadCounts };

    conversation.userIds.forEach((userId) => {
      if (userId !== user.uid) {
        updatedUnreadCounts[userId] = (updatedUnreadCounts[userId] || 0) + 1;
      }
    });

    return await this.conversationService.update(conversation.id, {
      lastMessageText: input,
      unreadCounts: updatedUnreadCounts,
    });
  }

  async sendMessage({
    input,
    conversationId,
  }: {
    input: string;
    conversationId: string;
  }) {
    const user = this.authService.getCurrentUser();
    if (!user) {
      throw new Error("User not found");
    }
    const conversation = await this.conversationService.get(conversationId);

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const messageData = {
      conversationId,
      authorId: user.uid,
      displayText: input,
      interpretationId: "12", // TODO: Get real interpretation ID
    };

    // Create the message first
    await super.create(messageData, { conversationId });

    await this.updateConversationWithMessageData(conversation, user, input);
  }
}
