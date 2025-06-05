import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { Model } from "@common/types";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { ValidationError } from "@/services/base/errors";
import { InterpretationClient } from "./InterpretationClient";
import { BaseModel } from "@common/models/base/base";
import { InterpretationParams } from "@common/models/interpretation/interpretation-params";

import { BaseUserService } from "@/services/base/BaseUserService";
import { AuthService } from "@/features/auth/api/service";

type InterpretationPersistParams = {
  model: Model;
  input: string;
};

export abstract class InterpretationService<
  T extends BaseModel,
  A,
  U,
  UA,
  O = any,
> extends BaseUserService<T> {
  protected abstract firestoreUserMessageTag: FirestoreCollections;
  protected abstract userMessageMapper: (x: any) => U;

  constructor(
    protected readonly client: InterpretationClient<A, O>,
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService, authService);
  }

  @withErrorHandling({
    errorMessage: "Error translating text",
    maxRetries: 0,
  })
  public async interpret(params: InterpretationParams<O>): Promise<A[]> {
    const { input, options } = params;
    const moderation = await this.client.moderateText({
      input,
    });

    if (moderation.flagged) {
      throw new ValidationError("User input flagged");
    }
    return await this.client.interpretText({
      model: Model.Gpt35Turbo,
      input,
      options,
    });
  }

  @withErrorHandling({
    errorMessage: `Error persisting`,
  })
  public async persist(
    interpretations: A[],
    options: InterpretationPersistParams
  ): Promise<void> {
    const { model, input } = options;

    // const userMessageDoc = await this.persistUserMessage(input);

    // const userMessageId = userMessageDoc.id;

    const populatedInterpretations = interpretations.map((interpretation) => ({
      ...interpretation,
      // originalMessageId: userMessageId,
      model,
    }));
    console.log(
      "populatedInterpretations",
      populatedInterpretations,
      this.firestoreTag
    );
    await Promise.all(
      populatedInterpretations.map((interpretation) =>
        this.firebaseService.addDocument(this.firestoreTag, interpretation)
      )
    );
  }

  @withErrorHandling({
    errorMessage: "Error persisting user message:",
    maxRetries: 0,
  })
  protected async persistUserMessage(text: string): Promise<any | undefined> {
    const userMessageDoc = await this.firebaseService.addDocument(
      this.firestoreUserMessageTag,
      { text }
    );
    if (!userMessageDoc) {
      throw new Error("Failed to persist user message");
    }
    return userMessageDoc;
  }

  public subscribeToUserMessages = (
    onData: (userMessages: U[]) => void,
    onError?: (error: Error) => void
  ) => {
    return this.firebaseService.subscribeToCollection<UA>(
      FirestoreCollections.USER_REFRAMING_MESSAGES,
      (data) => {
        const userMessages = data.map(this.userMessageMapper);
        onData(userMessages);
      },
      onError
    );
  };
}
