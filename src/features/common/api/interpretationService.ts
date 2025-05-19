import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { Interpretation } from "./models";
import { Model } from "./enums";
import { FirebaseService } from "@/services/firebase/data/service";
import { FirestoreCollections } from "@/services/firebase/collections";
import { ValidationError } from "@/services/base/errors";
import { InterpretationClient } from "..";
import { BaseService, BaseServiceConfig } from "./service";

type PersistParams = {
  model: Model;
  userText: string;
};
type InterpretationServiceConfig<
  T extends Interpretation,
  U
> = BaseServiceConfig<T> & {
  firestoreUserMessageTag: FirestoreCollections;
  userMessageMapper: (data: any) => U;
  generatePrompt: (...args: any) => string;
};

export class InterpretationService<
  T extends Interpretation,
  A,
  U,
  UA,
  Params extends { model: Model; input: string }
> extends BaseService<T, A> {
  constructor(
    protected readonly config: InterpretationServiceConfig<T, U>,
    protected readonly firebaseService: FirebaseService,
    protected readonly client: InterpretationClient<A>
  ) {
    super(config, firebaseService);
  }

  @withErrorHandling({
    errorMessage: "Error translating text",
  })
  public async interpret(params: Params): Promise<A[]> {
    const { model, input } = params;
    const moderation = await this.client.moderateText({
      input,
    });

    if (moderation.flagged) {
      throw new ValidationError("User input flagged");
    }

    const prompt = this.config.generatePrompt(params);

    return await this.client.interpretText({
      model,
      input: prompt,
    });
  }
  // <P extends PersistParams>
  @withErrorHandling({
    errorMessage: `Error persisting`,
  })
  public async persist(
    interpretations: A[],
    options: PersistParams
  ): Promise<void> {
    const { model, userText } = options;
    const userMessageDoc = await this.persistUserMessage(userText);

    const userMessageId = userMessageDoc.id;

    const populatedInterpretations = interpretations.map((interpretation) => ({
      ...interpretation,
      createdAt: new Date(),
      userMessageId,
      model,
    }));
    await Promise.all(
      populatedInterpretations.map((interpretation) =>
        this.firebaseService.addUserDocument(
          this.config.firestoreTag,
          interpretation
        )
      )
    );
  }

  @withErrorHandling({
    errorMessage: "Error persisting user message:",
    maxRetries: 0,
  })
  protected async persistUserMessage(text: string): Promise<any | undefined> {
    const userMessageDoc = await this.firebaseService.addUserDocument(
      this.config.firestoreUserMessageTag,
      { text }
    );
    if (!userMessageDoc) {
      throw new Error("Failed to persist user message");
    }
    return userMessageDoc;
  }

  public subscribeToUserMessages = (
    callback: (userMessages: U[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<UA>(
      FirestoreCollections.USER_REFRAMING_MESSAGES,
      (data) => {
        const userMessages = data.map(this.config.userMessageMapper);
        callback(userMessages);
      },
      onError
    );
  };
}
