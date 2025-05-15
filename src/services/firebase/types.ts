import { User } from "firebase/auth";
import { QueryConstraint, Timestamp } from "firebase/firestore";

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
