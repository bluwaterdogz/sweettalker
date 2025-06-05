import { firestore } from "@/app/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  DocumentData,
  Firestore,
  doc,
  serverTimestamp,
  Query,
  CollectionReference,
  deleteDoc,
  getDoc,
  setDoc,
  writeBatch,
  getDocs,
  Unsubscribe,
} from "firebase/firestore";
import { removeUndefined } from "@/services/firebase/utils";
import { FirebaseAuthService } from "../auth";

export type QueryBuilder = (
  ref: CollectionReference<DocumentData>
) => Query<DocumentData>;

//TODO:  Should these be accessible when the user is logged out? which should be?

export class FirebaseService {
  constructor(private readonly authService: FirebaseAuthService) {}

  async getDocument<T>(col: string, id: string): Promise<T | undefined> {
    const docRef = doc(firestore, col, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists()
      ? ({
          ...docSnap.data(),
          id: docSnap.id,
        } as T)
      : undefined;
  }

  async getDocumentList<T>(
    col: string,
    queryBuilder?: QueryBuilder
  ): Promise<T[]> {
    const colRef = collection(firestore, col);
    const q = queryBuilder ? queryBuilder(colRef) : colRef;
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        }) as T
    );
  }

  async addDocument<T>(col: string, data: T, db: Firestore = firestore) {
    const cleanData = removeUndefined(data);
    return addDoc(collection(db, col), {
      ...cleanData,
      createdBy: this.authService.getCurrentUser()?.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: this.authService.getCurrentUser()?.uid,
    });
  }

  async addDocumentList<T extends { [key: string]: any }>(
    subCollection: string,
    data: T[],
    db: Firestore = firestore
  ) {
    const batch = writeBatch(db);
    for (const item of data) {
      const docRef = doc(collection(db, subCollection));
      const cleanData = removeUndefined(item);
      batch.set(docRef, {
        ...cleanData,
        createdBy: this.authService.getCurrentUser()?.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        updatedBy: this.authService.getCurrentUser()?.uid,
      });
    }
    return await batch.commit();
  }

  // TODO for create or update, need a way to set createdAt
  async updateDocument<DTO>(
    col: string,
    docId: string,
    data: Partial<DTO>,
    db: Firestore = firestore
  ): Promise<void> {
    const docRef = doc(db, col, docId);
    const cleanData = removeUndefined(data);
    await setDoc(
      docRef,
      {
        ...cleanData,
        updatedAt: serverTimestamp(),
        updatedBy: this.authService.getCurrentUser()?.uid,
      },
      { merge: true }
    );
  }

  async deleteDocument(col: string, id: string): Promise<void> {
    const docRef = doc(firestore, col, id);
    await deleteDoc(docRef);
  }

  subscribeToDocument<T>(
    col: string,
    id: string,
    onData: (data: T) => void,
    onError?: (err: Error) => void
  ): Unsubscribe {
    const docRef = doc(firestore, col, id);
    return onSnapshot(docRef, {
      next: (doc) => {
        const identifiedData = {
          ...doc.data(),
          id: doc.id,
        } as T;
        onData(identifiedData);
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
  ): Unsubscribe {
    const colRef = collection(db, col);
    const q = queryBuilder ? queryBuilder(colRef) : colRef;
    return onSnapshot(q, {
      next: (querySnapshot) => {
        const data: T[] = querySnapshot.docs.map(
          (doc) =>
            ({
              ...doc.data(),
              id: doc.id,
            }) as T
        );
        onData(data);
      },
      error: onError,
    });
  }
}
