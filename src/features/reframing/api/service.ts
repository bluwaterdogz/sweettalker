import { ReframingMapper } from "./mappers";
import { Reframing, ReframingApi, ReframingModality } from "./models";

import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/service";
import { generatePrompt, modalityPrompts } from "../prompts";
import { InterpretationClient } from "@/features/common/api/client";
import { UserMessage, UserMessageApi } from "@/features/common/api/models";
import { UserMessageMapper } from "@/features/common/api/mappers";
import { Model } from "@/features/common/api/enums";
import { InterpretationService } from "@/features/common/api/interpretationService";

interface ReframeTextParams {
  model: Model;
  input: string;
  options: {
    modality?: ReframingModality;
  };
}

export class ReframingService extends InterpretationService<
  Reframing,
  ReframingApi,
  UserMessage,
  UserMessageApi,
  ReframeTextParams
> {
  constructor(
    protected readonly client: InterpretationClient<ReframingApi>,
    protected readonly firebaseService: FirebaseService
  ) {
    super(
      {
        firestoreTag: FirestoreCollections.REFRAMINGS,
        firestoreUserMessageTag: FirestoreCollections.USER_REFRAMING_MESSAGES,
        mapper: ReframingMapper.map,
        userMessageMapper: UserMessageMapper.map,
        generatePrompt,
      },
      firebaseService,
      client
    );
  }
}
