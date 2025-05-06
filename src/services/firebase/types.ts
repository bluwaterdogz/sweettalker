import { User } from "firebase/auth";
import { QueryConstraint } from "firebase/firestore";
import { Firestore } from "firebase/firestore";

export interface UserData {
  displayName: string;
  email: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
  };
}

export type AuthCallback = (user: User | null) => void;
export type DataCallback<T> = (data: T | null) => void;
export type CollectionCallback<T> = (data: T[]) => void;

export { QueryConstraint };

export interface FirebaseServiceI {
  addDocument<T>(col: string, data: T, db?: Firestore): Promise<any>;
  getCollection<T>(col: string, db?: Firestore): Promise<T[]>;
  subscribeToCollection<T>(
    col: string,
    onData: (data: T[]) => void,
    onError?: (err: Error) => void,
    db?: Firestore
  ): () => void;
  addUserDocument<T>(
    subCollection: string,
    data: T,
    db?: Firestore
  ): Promise<any>;
  getUserCollection<T>(subCollection: string, db?: Firestore): Promise<T[]>;
  subscribeToUserCollection<T>(
    subCollection: string,
    onData: (data: T[]) => void,
    onError?: (err: Error) => void,
    db?: Firestore
  ): () => void;
  updateUserDocument<T>(
    subCollection: string,
    docId: string,
    data: Partial<T>,
    db?: Firestore
  ): Promise<void>;
}
