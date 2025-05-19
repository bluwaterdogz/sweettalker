import { TranslationMapper } from "./mappers";
import { Translation, TranslationApi } from "./models";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/service";
import { generateRelationalPrompt, PromptOptions } from "../utils";
import { arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { InterpretationClient } from "@/features/common/api/client";
import { UserMessage, UserMessageApi } from "@/features/common/api/models";
import { UserMessageMapper } from "@/features/common/api/mappers";
import { Model } from "@/features/common/api/enums";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { InterpretationService } from "@/features/common/api/interpretationService";

interface TranslateTextParams {
  model: Model;
  input: string;
  options: PromptOptions;
}

export class TranslationService extends InterpretationService<
  Translation,
  TranslationApi,
  UserMessage,
  UserMessageApi,
  TranslateTextParams
> {
  constructor(
    protected readonly client: InterpretationClient<TranslationApi>,
    protected readonly firebaseService: FirebaseService
  ) {
    super(
      {
        firestoreTag: FirestoreCollections.TRANSLATIONS,
        firestoreUserMessageTag: FirestoreCollections.USER_MESSAGES,
        mapper: TranslationMapper.map,
        userMessageMapper: UserMessageMapper.map,
        generatePrompt: generateRelationalPrompt,
      },
      firebaseService,
      client
    );
  }

  @withErrorHandling({
    errorMessage: `Error updating text `,
  })
  async updateTranslationText(id: string, text: string): Promise<void> {
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
  }
}
