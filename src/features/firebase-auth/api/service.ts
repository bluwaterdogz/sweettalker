import { authService } from "@/services/firebase/auth";
import { SignInRequest, SignUpRequest } from "@/services/firebase/auth/types";
import {
  Credentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "./models";
import { auth } from "@/services/firebase/auth";
import { mapFirebaseUser } from "./mappers";
import { mockAuth, isMockAuthEnabled, mockUser } from "./mock";

export class FirebaseAuthService {
  getCurrentUserId(): string {
    if (isMockAuthEnabled()) {
      return mockUser.uid;
    }
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No authenticated user found");
    }
    return currentUser.uid;
  }

  async login(credentials: Credentials): Promise<LoginResponse> {
    if (isMockAuthEnabled()) {
      return { user: mockUser };
    }
    try {
      const signInRequest: SignInRequest = {
        email: credentials.email,
        password: credentials.password,
      };
      const response = await authService.signIn(signInRequest);
      return {
        user: mapFirebaseUser(response.user),
      };
    } catch (error) {
      console.log("login error", error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    if (isMockAuthEnabled()) {
      return { user: mockUser };
    }
    try {
      const signUpRequest: SignUpRequest = {
        email: credentials.email,
        password: credentials.password,
        displayName: credentials.username,
      };
      const response = await authService.signUp(signUpRequest);
      return {
        user: mapFirebaseUser(response.user),
      };
    } catch (error) {
      console.log("reg error", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (isMockAuthEnabled()) {
      return;
    }
    try {
      await authService.logout();
    } catch (error) {
      throw error;
    }
  }

  onAuthStateChanged(
    callback: (user: LoginResponse | null) => void
  ): () => void {
    if (isMockAuthEnabled()) {
      callback({ user: mockUser });
      return () => {};
    }
    return authService.onAuthStateChange((firebaseUser) => {
      callback(firebaseUser ? { user: mapFirebaseUser(firebaseUser) } : null);
    });
  }
}

export const firebaseAuthService = new FirebaseAuthService();
