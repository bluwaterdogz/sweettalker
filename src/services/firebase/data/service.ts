import { firestore } from "@/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  DocumentData,
  Firestore,
  doc,
  updateDoc,
  serverTimestamp,
  Query,
  CollectionReference,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { removeUndefined } from "@/services/firebase/utils";
import { FirestoreCollections } from "@/services/firebase/collections";
import { FirebaseAuthService } from "../auth/service";

//TODO:  Should these be accessible when the user is logged out? which should be?

export class FirebaseService {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

  private async addDocument<T>(
    col: string,
    data: T,
    db: Firestore = firestore
  ) {
    const cleanData = removeUndefined(data);
    return addDoc(collection(db, col), cleanData as any);
  }

  async addUserDocument<T>(
    subCollection: string,
    data: T,
    db: Firestore = firestore
  ) {
    const user = this.firebaseAuthService.getCurrentUser();
    return this.addDocument(
      this.userCollectionPath(subCollection),
      {
        ...data,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      },
      db
    );
  }

  async updateOrCreateUserDocument<T>(
    subCollection: string,
    docId: string,
    data: Partial<T>,
    db: Firestore = firestore
  ): Promise<void> {
    const user = this.firebaseAuthService.getCurrentUser();
    const docRef = doc(db, this.userCollectionPath(subCollection), docId);
    const cleanData = removeUndefined(data);
    await setDoc(
      docRef,
      {
        ...cleanData,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      },
      { merge: true }
    );
  }

  async updateUserDocument<T>(
    subCollection: string,
    docId: string,
    data: Partial<T>,
    db: Firestore = firestore
  ): Promise<void> {
    const user = this.firebaseAuthService.getCurrentUser();
    const docRef = doc(db, this.userCollectionPath(subCollection), docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: user.uid,
    });
  }

  async deleteUserDocument(
    collection: FirestoreCollections,
    id: string
  ): Promise<void> {
    const docRef = doc(firestore, this.userCollectionPath(collection), id);
    await deleteDoc(docRef);
  }

  async getUserDocument<T>(
    id: string,
    collection: FirestoreCollections
  ): Promise<T | null> {
    const docRef = doc(firestore, this.userCollectionPath(collection), id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as T) : null;
  }

  async subscribeToUserDocument<T>(
    collection: FirestoreCollections,
    onData: (data: T) => void,
    onError?: (err: Error) => void
  ) {
    const docRef = doc(firestore, this.userCollectionPath(collection));
    return onSnapshot(docRef, {
      next: (docSnap) => {
        const data = docSnap.data() as T;
        onData(data);
      },
      error: onError,
    });
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
    const colRef = collection(db, col);
    const q = queryBuilder ? queryBuilder(colRef) : colRef;
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

  private userCollectionPath(subCollection: string) {
    const user = this.firebaseAuthService.getCurrentUser();
    return `users/${user.uid}/${subCollection}`;
  }
}
