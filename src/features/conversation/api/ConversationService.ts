import { BaseService } from "@/services/base/BaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import { Conversation, ConversationMapper } from "@common/models/conversation";
import { BaseModel } from "@common/models/base/base";
import { QueryOptions } from "@/services/firebase/data/query";
import { auth } from "@/app/firebase";

export class ConversationService extends BaseService<Conversation> {
  protected firestoreTag: FirestoreCollections.CONVERSATIONS =
    FirestoreCollections.CONVERSATIONS;

  protected mapper = ConversationMapper.map;
  protected getDefaultListQueryOptions(): QueryOptions {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error(
        "User authentication is required for conversation retrieval"
      );
    }
    return {
      where: [
        {
          field: "userIds",
          operator: "array-contains",
          value: userId,
        },
      ],
      // orderBy: [{ field: "updatedAt", direction: "desc" }],
    };
  }

  constructor(protected readonly firebaseService: FirebaseService) {
    super(firebaseService);
  }

  async update(id: string, data: Partial<Conversation>) {
    return await super.update(id, data);
  }

  async create(data: Omit<Conversation, keyof BaseModel>): Promise<void> {
    await super.create(data);
  }

  async getConversationId(contactId: string) {
    const conversations = await super.getList({
      soleQuery: {
        where: [
          {
            field: "userIds",
            operator: "array-contains",
            value: auth.currentUser?.uid,
          },
        ],
      },
    });

    return conversations.find((c) => c.userIds.includes(contactId))?.id;
  }
}
