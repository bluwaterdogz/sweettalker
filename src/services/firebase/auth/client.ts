import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { SignInRequest, SignUpRequest, ResetPasswordRequest } from "./types";
import { auth, firestore } from "@/app/firebase";
import { mockUser } from "@/features/auth/api/mock";
import { isMockAuthEnabled } from "@/features/auth/api/mock";
import { doc, setDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

// Auth client implementation
export class FirebaseAuthClient {
  async signIn(request: SignInRequest): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      request.email,
      request.password
    );
    return userCredential.user;
  }

  async signUp(request: SignUpRequest): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      request.email,
      request.password
    );
    await updateProfile(userCredential.user, {
      displayName: request.displayName,
    });

    return userCredential.user;
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await sendPasswordResetEmail(auth, request.email);
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | undefined {
    if (isMockAuthEnabled()) {
      return mockUser;
    }
    const user = auth.currentUser;
    return user || undefined;
  }
}
