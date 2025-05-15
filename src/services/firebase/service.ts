import { firestore } from "@/firebase";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  DocumentData,
  Firestore,
  doc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
  Query,
  CollectionReference,
} from "firebase/firestore";
import { firebaseAuthService } from "@/features/firebase-auth/api/service";

import { removeUndefined } from "@/services/firebase/utils";

export class FirebaseService {
  async addDocument<T>(col: string, data: T, db: Firestore = firestore) {
    const cleanData = removeUndefined(data);
    console.log("cleanData", cleanData);
    return addDoc(collection(db, col), cleanData as any);
  }

  async getCollection<T>(col: string, db: Firestore = firestore): Promise<T[]> {
    const querySnapshot = await getDocs(collection(db, col));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
  }

  subscribeToCollection<T>(
    col: string,
    onData: (data: T[]) => void,
    onError?: (err: Error) => void,
    db: Firestore = firestore,
    queryBuilder?: (
      ref: CollectionReference<DocumentData>
    ) => Query<DocumentData>
  ): () => void {
    const q = queryBuilder
      ? queryBuilder(collection(db, col))
      : query(collection(db, col), orderBy("createdAt", "desc"));
    return onSnapshot(q, {
      next: (querySnapshot) => {
        const data: T[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        onData(data);
      },
      error: onError,
    });
  }
  private userCollectionPath(subCollection: string) {
    const userId = firebaseAuthService.getCurrentUserId();
    return `users/${userId}/${subCollection}`;
  }

  async addUserDocument<T>(
    subCollection: string,
    data: T,
    db: Firestore = firestore
  ) {
    return this.addDocument(
      this.userCollectionPath(subCollection),
      {
        ...data,
        createdAt: serverTimestamp(),
        createdBy: firebaseAuthService.getCurrentUserId(),
      },
      db
    );
  }

  async getUserCollection<T>(
    subCollection: string,
    db: Firestore = firestore
  ): Promise<T[]> {
    return this.getCollection<T>(this.userCollectionPath(subCollection), db);
  }

  subscribeToUserCollection<T>(
    subCollection: string,
    onData: (data: T[]) => void,
    onError?: (err: Error) => void,
    db: Firestore = firestore,
    queryBuilder?: (
      ref: CollectionReference<DocumentData>
    ) => Query<DocumentData>
  ): () => void {
    return this.subscribeToCollection<T>(
      this.userCollectionPath(subCollection),
      onData,
      onError,
      db,
      queryBuilder
    );
  }

  async updateUserDocument<T>(
    subCollection: string,
    docId: string,
    data: Partial<T>,
    db: Firestore = firestore
  ): Promise<void> {
    const docRef = doc(db, this.userCollectionPath(subCollection), docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: firebaseAuthService.getCurrentUserId(),
    });
  }
}
