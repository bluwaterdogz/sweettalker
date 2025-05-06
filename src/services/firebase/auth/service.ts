import { User } from "firebase/auth";
import { authClient } from "./client";
import {
  AuthService,
  SignInRequest,
  SignUpRequest,
  ResetPasswordRequest,
  SignInResponse,
  SignUpResponse,
  ResetPasswordResponse,
} from "./types";
import { AuthError } from "../errors";

// Auth service implementation
export const authService: AuthService = {
  async signIn(request: SignInRequest): Promise<SignInResponse> {
    try {
      const user = await authClient.signIn(request);
      return { user };
    } catch (error) {
      throw new AuthError({
        code: (error as any).code,
        message: "Failed to sign in: " + (error as Error).message,
      });
    }
  },

  async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    try {
      const user = await authClient.signUp(request);
      // Initialize user data in database
      // await create({
      //   collectionName: COLLECTIONS.USERS,
      //   data: {
      //     displayName: request.displayName,
      //     email: request.email,
      //     preferences: DEFAULT_USER_PREFERENCES,
      //   },
      //   id: user.uid,
      // });
      return { user };
    } catch (error) {
      throw new AuthError({
        code: (error as any).code,
        message: "Failed to sign up: " + (error as Error).message,
      });
    }
  },

  async logout(): Promise<void> {
    try {
      await authClient.logout();
    } catch (error) {
      throw new AuthError({
        code: (error as any).code,
        message: "Failed to logout: " + (error as Error).message,
      });
    }
  },

  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      await authClient.resetPassword(request);
      return { success: true };
    } catch (error) {
      throw new AuthError({
        code: (error as any).code,
        message: "Failed to reset password: " + (error as Error).message,
      });
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return authClient.onAuthStateChange(callback);
  },
};

// Export auth instance for direct access if needed
export { auth } from "./client";
