import { TranslationMapper } from "./mappers";
import { Translation, TranslationApi } from "./models";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/service";
import { RelationalContext } from "../enums";
import { generateRelationalPrompt } from "../utils";
import { arrayUnion, DocumentReference } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { InterpretationClient } from "@/features/common-interpretation/api/client";
import {
  UserMessage,
  UserMessageApi,
} from "@/features/common-interpretation/api/models";
import { UserMessageMapper } from "@/features/common-interpretation/api/mappers";
import { Model } from "@/features/common-interpretation/api/enums";

interface TranslateTextParams {
  model: Model;
  input: string;
}

export class TranslationService {
  constructor(
    private client: InterpretationClient<TranslationApi>,
    private firebaseService: FirebaseService
  ) {}

  async translateText(params: TranslateTextParams): Promise<TranslationApi[]> {
    try {
      const { model, input } = params;

      const moderation = await this.client.moderateText({
        input,
      });

      if (moderation.flagged) {
        throw new Error("User input flagged");
      }

      const prompt = generateRelationalPrompt({
        userMessage: input,
        model,
        context: RelationalContext.Romantic,
      });

      const translations = await this.client.interpretText({
        model,
        input: prompt,
      });
      return translations;
    } catch (error) {
      console.error("Error translating text:", error);
      throw error;
    }
  }

  private async persistTranslations(
    translations: TranslationApi[],
    { model, userMessageId }: { model: Model; userMessageId: string }
  ): Promise<void> {
    try {
      const formattedTranslations = translations.map((translation) => ({
        ...translation,
        createdAt: new Date(),
        userMessageId,
        model,
      }));
      await Promise.all(
        formattedTranslations.map((translation) =>
          this.firebaseService.addUserDocument(
            FirestoreCollections.TRANSLATIONS,
            translation
          )
        )
      );
    } catch (error) {
      console.error("Error persisting translations:", error);
    }
  }

  private async persistUserMessage(
    text: string
  ): Promise<DocumentReference<UserMessageApi> | undefined> {
    try {
      const userMessageDoc = await this.firebaseService.addUserDocument(
        FirestoreCollections.USER_MESSAGES,
        { text }
      );
      if (!userMessageDoc) {
        throw new Error("Failed to persist user message");
      }
      return userMessageDoc;
    } catch (error) {
      console.error("Error persisting user message:", error);
    }
  }

  async persistUserMessageAndTranslations(
    userText: string,
    translations: TranslationApi[],
    { model }: { model: Model }
  ): Promise<void> {
    try {
      const userMessageDoc = await this.persistUserMessage(userText);

      if (!userMessageDoc) {
        throw new Error("Failed to persist user message");
      }

      const userMessageId = userMessageDoc.id;

      await this.persistTranslations(translations, { model, userMessageId });
    } catch (error) {
      console.error("Error persisting user message and translations:", error);
    }
  }

  async fetchAllTranslations(): Promise<Translation[]> {
    const data = await this.firebaseService.getUserCollection<TranslationApi>(
      FirestoreCollections.TRANSLATIONS
    );
    return data.map(TranslationMapper.map);
  }

  async fetchAllUserMessages(): Promise<UserMessage[]> {
    const data = await this.firebaseService.getUserCollection<UserMessageApi>(
      FirestoreCollections.USER_MESSAGES
    );
    return data.map(UserMessageMapper.map);
  }

  subscribeToTranslations = (
    callback: (translations: Translation[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<TranslationApi>(
      FirestoreCollections.TRANSLATIONS,
      (data) => {
        const translations = data.map(TranslationMapper.map);
        callback(translations);
      },
      onError
    );
  };

  subscribeToUserMessages = (
    callback: (userMessages: UserMessage[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<UserMessageApi>(
      FirestoreCollections.USER_MESSAGES,
      (data) => {
        const userMessages = data.map(UserMessageMapper.map);
        callback(userMessages);
      },
      onError
    );
  };

  // General update function for translations
  async updateTranslation(
    id: string,
    data: Partial<Translation>
  ): Promise<void> {
    try {
      await this.firebaseService.updateUserDocument(
        FirestoreCollections.TRANSLATIONS,
        id,
        data
      );
    } catch (error) {
      console.error("Error updating translation:", error);
      throw error;
    }
  }

  async updateTranslationText(id: string, text: string): Promise<void> {
    try {
      const newEdit = {
        text,
        createdAt: new Date(),
        id: uuidv4(),
      };
      await this.firebaseService.updateUserDocument<Translation>(
        FirestoreCollections.TRANSLATIONS,
        id,
        {
          text,
          priorEdits: arrayUnion(newEdit) as unknown as any[],
        }
      );
    } catch (error) {
      console.error("Error updating translation:", error);
      throw error;
    }
  }
}
