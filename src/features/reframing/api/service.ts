import { ReframingMapper } from "./mappers";
import { Reframing, ReframingApi } from "./models";

import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/service";
import { ReframingModalityIdentifier } from "../enums";
import { generatePrompt } from "../prompts";
import { DocumentReference } from "firebase/firestore";
import { InterpretationClient } from "@/features/common-interpretation/api/client";
import {
  UserMessage,
  UserMessageApi,
} from "@/features/common-interpretation/api/models";
import { UserMessageMapper } from "@/features/common-interpretation/api/mappers";
import { Model } from "@/features/common-interpretation/api/enums";

interface ReframeTextParams {
  model: Model;
  input: string;
}

export class ReframingService {
  constructor(
    private client: InterpretationClient<ReframingApi>,
    private firebaseService: FirebaseService
  ) {}

  async reframeText(params: ReframeTextParams): Promise<ReframingApi[]> {
    try {
      const { model, input } = params;

      const moderation = await this.client.moderateText({
        input,
      });

      if (moderation.flagged) {
        throw new Error("User input flagged");
      }

      const prompt = generatePrompt(
        input,
        ReframingModalityIdentifier.POSITIVE_PSYCHOLOGY
      );

      const reframings = await this.client.interpretText({
        model,
        input: prompt,
      });

      return reframings;
    } catch (error) {
      console.error("Error reframing text:", error);
      throw error;
    }
  }

  private async persistReframings(
    reframings: ReframingApi[],
    { model, userMessageId }: { model: Model; userMessageId: string }
  ): Promise<void> {
    try {
      const formattedReframings = reframings.map((reframing) => ({
        ...reframing,
        createdAt: new Date(),
        userMessageId,
        model,
      }));
      await Promise.all(
        formattedReframings.map((reframing) =>
          this.firebaseService.addUserDocument(
            FirestoreCollections.REFRAMINGS,
            reframing
          )
        )
      );
    } catch (error) {
      console.error("Error persisting reframings:", error);
    }
  }

  private async persistUserMessage(
    text: string
  ): Promise<DocumentReference<UserMessageApi> | undefined> {
    try {
      const userMessageDoc = await this.firebaseService.addUserDocument(
        FirestoreCollections.USER_REFRAMING_MESSAGES,
        { text }
      );
      if (!userMessageDoc) {
        throw new Error("Failed to persist user message");
      }
      return userMessageDoc;
    } catch (error) {
      console.error("Error persisting reframings:", error);
    }
  }

  async persistUserMessageAndReframings(
    userText: string,
    reframings: ReframingApi[],
    { model }: { model: Model }
  ): Promise<void> {
    try {
      // Persist the user message
      const userMessageDoc = await this.persistUserMessage(userText);

      if (!userMessageDoc) {
        throw new Error("Failed to persist user message");
      }

      const userMessageId = userMessageDoc.id;

      await this.persistReframings(reframings, { model, userMessageId });
    } catch (error) {
      console.error("Error persisting user message and reframings:", error);
    }
  }

  async fetchAllUserMessages(): Promise<UserMessage[]> {
    const data = await this.firebaseService.getUserCollection<UserMessageApi>(
      FirestoreCollections.USER_MESSAGES
    );
    return data.map(UserMessageMapper.map);
  }

  subscribeToReframings = (
    callback: (reframings: Reframing[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<ReframingApi>(
      FirestoreCollections.REFRAMINGS,
      (data) => {
        const reframings = data.map(ReframingMapper.map);
        callback(reframings);
      },
      onError
    );
  };

  subscribeToUserMessages = (
    callback: (userMessages: UserMessage[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<UserMessageApi>(
      FirestoreCollections.USER_REFRAMING_MESSAGES,
      (data) => {
        const userMessages = data.map(UserMessageMapper.map);
        callback(userMessages);
      },
      onError
    );
  };

  async updateReframing(id: string, data: Partial<Reframing>): Promise<void> {
    try {
      await this.firebaseService.updateUserDocument(
        FirestoreCollections.REFRAMINGS,
        id,
        data
      );
    } catch (error) {
      console.error("Error updating reframing:", error);
      throw error;
    }
  }
}
