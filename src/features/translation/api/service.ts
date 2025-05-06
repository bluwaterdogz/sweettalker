import { TranslationClient } from "./client";
import {
  ModerationMapper,
  TranslationMapper,
  UserMessageMapper,
} from "./mappers";
import {
  Moderation,
  Translation,
  UserMessage,
  TranslationApi,
  UserMessageApi,
} from "./models";
import { ModerateTextParams, TranslateTextParams } from "./client";
import { FirestoreCollections } from "@/store/collections";
import { FirebaseServiceI } from "@/services/firebase/types";
import { Model } from "../enums";

export class TranslationService {
  constructor(
    private client: TranslationClient,
    private firebaseService: FirebaseServiceI
  ) {}

  async moderateText(params: ModerateTextParams): Promise<Moderation> {
    try {
      const response = await this.client.moderateText(params);
      return ModerationMapper.map(response);
    } catch (error) {
      console.error("Error moderating text:", error);
      throw error;
    }
  }

  async translateText(params: TranslateTextParams): Promise<TranslationApi[]> {
    try {
      const response = await this.client.translateText(params);
      return response;
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

  async persistUserMessageAndTranslations(
    userText: string,
    translations: TranslationApi[],
    { model }: { model: Model }
  ): Promise<void> {
    try {
      // Persist the user message
      const userMessageData: Omit<UserMessage, "id"> = {
        text: userText,
        createdAt: new Date(),
      };
      const userMessageDoc = await this.firebaseService.addUserDocument(
        FirestoreCollections.USER_MESSAGES,
        userMessageData
      );

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
      // Firestore path: users/{uid}/translations/{id}
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
}
