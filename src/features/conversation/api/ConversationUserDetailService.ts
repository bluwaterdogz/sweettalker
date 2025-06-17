import { BaseServiceOptions } from "@/services/base/BaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import {
  ConversationUserDetails,
  ConversationUserDetailsDTO,
  ConversationUserDetailsMapper,
} from "@common/models/conversation/conversation_user_details";
import { BaseCustomIdService } from "@/services/base/BaseCustomIdService";

interface ConversationUserDetailPathOptions {
  conversationId: string;
  userId: string;
}

interface ConversationUserDetailOptions
  extends BaseServiceOptions,
    ConversationUserDetailPathOptions {}

export class ConversationUserDetailService extends BaseCustomIdService<
  ConversationUserDetails,
  ConversationUserDetailsDTO,
  ConversationUserDetailOptions
> {
  protected firestoreTag: FirestoreCollections.CONVERSATION_USER_DETAILS =
    FirestoreCollections.CONVERSATION_USER_DETAILS;

  protected mapper = ConversationUserDetailsMapper.map;

  protected getPathPrefix(
    options: BaseServiceOptions & { conversationId: string; userId: string }
  ): string {
    return `${FirestoreCollections.CONVERSATIONS}/${options.conversationId}/${this.firestoreTag}`;
  }

  protected getId(options: ConversationUserDetailOptions): string {
    return `${options.userId}`;
  }

  // TODO: detailed permission error that tells you your auth must have permission to read the conversation?
  constructor(protected readonly firebaseService: FirebaseService) {
    super(firebaseService);
  }
}
