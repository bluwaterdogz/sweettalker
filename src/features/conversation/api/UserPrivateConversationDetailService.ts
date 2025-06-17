import { BaseServiceOptions } from "@/services/base/BaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";

import {
  BaseCustomIdService,
  BaseCustomIdServiceInterface,
} from "@/services/base/BaseCustomIdService";
import type {
  UserPrivateConversationDetails,
  UserPrivateConversationDetailsDTO,
} from "@common/models/conversation/user_private_conversation_details";
import { UserPrivateConversationDetailsMapper } from "@common/models/conversation/user_private_conversation_details";
import { BaseUserCustomIdService } from "@/services/base/BaseUserCustomIdService";
import { AuthService } from "@/features/auth/api/service";

interface UserPrivateConversationDetailPathOptions {
  conversationId: string;
}

interface UserPrivateConversationDetailOptions
  extends BaseServiceOptions,
    UserPrivateConversationDetailPathOptions {}

export class UserPrivateConversationDetailService extends BaseUserCustomIdService<
  UserPrivateConversationDetails,
  UserPrivateConversationDetailsDTO,
  UserPrivateConversationDetailOptions
> {
  protected firestoreTag: FirestoreCollections.USER_PRIVATE_CONVERSATION_DETAILS =
    FirestoreCollections.USER_PRIVATE_CONVERSATION_DETAILS;

  protected mapper = UserPrivateConversationDetailsMapper.map;

  protected getPathPrefix(): string {
    return this.addUserPathPrefix(this.firestoreTag);
  }

  public getId(options: UserPrivateConversationDetailOptions): string {
    return options.conversationId;
  }

  constructor(
    protected readonly firebaseService: FirebaseService,
    protected readonly authService: AuthService
  ) {
    super(firebaseService, authService);
  }
}
