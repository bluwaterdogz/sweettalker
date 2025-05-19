import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { BaseModel } from "@/services/base/model";
import { FirebaseService } from "@/services/firebase/data/service";
import { FirestoreCollections } from "@/services/firebase/collections";
import { orderBy, query } from "firebase/firestore";

export interface BaseServiceConfig<T extends BaseModel> {
  firestoreTag: FirestoreCollections;
  mapper: (data: any) => T;
}

export class BaseService<T extends BaseModel, A> {
  constructor(
    protected readonly config: BaseServiceConfig<T>,
    protected readonly firebaseService: FirebaseService
  ) {}

  @withErrorHandling({
    errorMessage: `Error persisting`,
  })
  public async persist(entities: A[], _unusedOptions?: any): Promise<void> {
    // TODO: batch persist
    await Promise.all(
      entities.map((entity) =>
        this.firebaseService.addUserDocument(this.config.firestoreTag, entity)
      )
    );
  }

  @withErrorHandling({
    errorMessage: "Error updating",
  })
  public async update(id: string, data: Partial<T>): Promise<void> {
    await this.firebaseService.updateOrCreateUserDocument(
      this.config.firestoreTag,
      id,
      data
    );
  }

  @withErrorHandling({
    errorMessage: "Error deleting",
  })
  public async delete(id: string): Promise<void> {
    await this.firebaseService.deleteUserDocument(this.config.firestoreTag, id);
  }

  subscribeSingle = (
    callback: (entity: T) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<T>(
      FirestoreCollections.SETTINGS,
      (data) => {
        const entityData = data[0];
        const entity = this.config.mapper(entityData || {});
        callback(entity);
      },
      onError
    );
  };

  public subscribe = (
    callback: (entities: T[]) => void,
    onError?: (error: Error) => void
  ): (() => void) => {
    return this.firebaseService.subscribeToUserCollection<A>(
      this.config.firestoreTag,
      (data) => {
        const interpretations = data.map(this.config.mapper);
        callback(interpretations);
      },
      onError,
      undefined,
      (ref) => {
        return query(ref, orderBy("createdAt", "desc"));
      }
    );
  };
}
