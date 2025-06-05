import { BaseService } from "@/services/base/BaseService";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseService } from "@/services/firebase/data/FirebaseService";
import {
  Connection,
  ConnectionMapper,
} from "@common/models/contacts/connection";
import { QueryOptions } from "@/services/firebase/data/query";
import { auth } from "@/app/firebase";

export class ConnectionService extends BaseService<Connection> {
  protected firestoreTag: FirestoreCollections.USER_CONNECTIONS =
    FirestoreCollections.USER_CONNECTIONS;
  protected mapper = ConnectionMapper.map;

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
        {
          operator: "OR",
          conditions: [
            {
              field: "receiverId",
              operator: "!=",
              value: userId,
            },
            {
              field: "status",
              operator: "in",
              value: ["pending", "accepted"],
            },
          ],
        },
      ],
    };
  }

  public getBlockedUsers() {}

  constructor(protected readonly firebaseService: FirebaseService) {
    super(firebaseService);
  }
}
