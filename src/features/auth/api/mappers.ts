import { User } from "./models";
import { User as FirebaseUser } from "firebase/auth";
// Mappers
export function mapFirebaseUser(data: FirebaseUser): User {
  return {
    uid: data.uid,
    username: data.displayName || data.email?.split("@")[0] || "",
    email: data.email || "",
    emailVerified: data.emailVerified,
  };
}
