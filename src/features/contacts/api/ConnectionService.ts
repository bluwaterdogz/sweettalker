import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import {
  Connection,
  ConnectionMapper,
} from "@common/models/contacts/connection";
import { QueryOptions } from "@/services/firebase/data/query";
import { auth } from "@/app/firebase";
import { BaseCustomIdService } from "@/services/base/BaseCustomIdService";
import { BaseServiceOptions } from "@/services/base/BaseService";

interface ConnectionKeyOptions {
  id1: string;
  id2: string;
}

export class ConnectionService extends BaseCustomIdService<
  Connection,
  any,
  BaseServiceOptions & ConnectionKeyOptions
> {
  protected firestoreTag: FirestoreCollections.USER_CONNECTIONS =
    FirestoreCollections.USER_CONNECTIONS;

  protected mapper = ConnectionMapper.map;

  protected getId({ id1, id2 }: ConnectionKeyOptions) {
    return [id1, id2].sort().join("_");
  }

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
        // {
        //   operator: "OR",
        //   conditions: [
        //     {
        //       field: "receiverId",
        //       operator: "!=",
        //       value: userId,
        //     },
        //     {
        //       field: "status",
        //       operator: "in",
        //       value: ["pending", "accepted"],
        //     },
        //   ],
        // },
      ],
    };
  }

  public getBlockedUsers() {}

  constructor(protected readonly firebaseService: FirebaseService) {
    super(firebaseService);
  }
}
