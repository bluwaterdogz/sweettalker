import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { InterpretationClient } from "@/features/interpretation/api/InterpretationClient";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { InterpretationService } from "@/features/interpretation/api/InterpretationService";
import { TranslationOptions } from "@common/models/translation/translation-options";
import { AuthService } from "@/features/auth/api/service";
import {
  Translation,
  TranslationDTO,
  TranslationMapper,
} from "@common/models/translation/translation";
import {
  UserMessage,
  UserMessageDTO,
  UserMessageMapper,
} from "@common/models/interpretation/user-message";
import { MessageOptimalResult } from "@common/models/chat/message-optimal-result";
import { ConversationSentiment } from "@common/models/chat/conversation-sentiment";
import { Message } from "@common/models/chat/message";
import { ResponseSuggestion } from "@common/models/chat/response-suggestion";
import { ResponseSuggestionsPromptOptions } from "@common/query/response-suggestion-prompt-options";

export class TranslationService extends InterpretationService<
  Translation,
  TranslationDTO,
  UserMessage,
  UserMessageDTO,
  TranslationOptions
> {
  protected firestoreTag: FirestoreCollections.TRANSLATIONS =
    FirestoreCollections.TRANSLATIONS;

  protected firestoreUserMessageTag: FirestoreCollections.USER_MESSAGES =
    FirestoreCollections.USER_MESSAGES;
  protected mapper = TranslationMapper.map;
  protected userMessageMapper = UserMessageMapper.map;

  constructor(
    protected readonly client: InterpretationClient<TranslationDTO>,
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(client, firebaseService, authService);
  }

  @withErrorHandling({
    errorMessage: `Error updating text `,
  })
  async updateTranslationText(id: string, text: string): Promise<void> {
    //TODO: switch to edit interpretation
    // const newEdit = {
    //   text,
    //   createdAt: new Date(),
    //   id: uuidv4(),
    // };
    // await this.firebaseService.updateUserDocument<Translation>(
    //   FirestoreCollections.TRANSLATIONS,
    //   id,
    //   {
    //     text,
    //     priorEdits: arrayUnion(newEdit) as unknown as any[],
    //   }
    // );
  }

  async isMessageOptimal(message: string): Promise<MessageOptimalResult> {
    return await this.client.isMessageOptimal(message);
  }

  async getConversationSentiment(
    messages: Message[],
    userId: string
  ): Promise<ConversationSentiment> {
    const formattedMessages = formatRecentMessages(messages, userId, {
      numRecent: 25,
      numPerUser: 3,
    });
    return await this.client.getConversationSentiment(formattedMessages);
  }

  async getResponseSuggestions(
    messages: Message[],
    userId: string,
    options: Omit<ResponseSuggestionsPromptOptions, "messages">
  ): Promise<ResponseSuggestion[]> {
    const formattedMessages = formatRecentMessages(messages, userId, {
      numRecent: 15,
      numPerUser: 3,
    });

    return await this.client.getResponseSuggestions({
      messages: formattedMessages,
      ...options,
    });
  }
}

function formatRecentMessages(
  messages: Message[],
  userId: string,
  options: {
    numRecent?: number;
    numPerUser?: number;
  } = {}
): string[] {
  const { numRecent = 10, numPerUser = 3 } = options;
  const sorted = [...messages].sort(
    (a, b) => a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime()
  );

  const lastRecent = sorted.slice(-numRecent);

  const userMessages = sorted
    .filter((m) => m.createdBy === userId)
    .slice(-numPerUser);
  const partnerMessages = sorted
    .filter((m) => m.createdBy !== userId)
    .slice(-numPerUser);

  const combined = [...lastRecent, ...userMessages, ...partnerMessages];

  const uniqueMessages = Array.from(
    new Map(
      combined.map((m) => [
        m.id ||
          m.createdAt.toDate().getTime() +
            "::" +
            m.createdBy +
            "::" +
            m.displayText,
        m,
      ])
    ).values()
  );

  const finalSorted = uniqueMessages.sort(
    (a, b) => a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime()
  );

  return finalSorted.map(
    (msg) =>
      msg.createdAt.toDate().toISOString() +
      " " +
      (msg.createdBy === userId ? "You" : "Partner") +
      ": " +
      msg.displayText
  );
}
