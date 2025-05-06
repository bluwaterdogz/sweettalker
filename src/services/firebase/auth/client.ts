import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import {
  AuthClient,
  SignInRequest,
  SignUpRequest,
  ResetPasswordRequest,
} from "./types";
import { auth } from "@/firebase";

// Auth client implementation
export const authClient: AuthClient = {
  async signIn(request: SignInRequest): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      request.email,
      request.password
    );
    return userCredential.user;
  },

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
  },

  async logout(): Promise<void> {
    await signOut(auth);
  },

  async resetPassword(request: ResetPasswordRequest): Promise<void> {
    await sendPasswordResetEmail(auth, request.email);
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};

// Export auth instance for direct access if needed
export { auth };
