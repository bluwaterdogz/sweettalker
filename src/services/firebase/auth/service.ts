import { User } from "firebase/auth";
import {
  SignInRequest,
  SignUpRequest,
  ResetPasswordRequest,
  SignInResponse,
  SignUpResponse,
  ResetPasswordResponse,
} from "./types";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { FirebaseAuthClient } from "./client";
import { AuthError } from "@/services/base/errors/model/AuthError";

// Auth service implementation
export class FirebaseAuthService {
  constructor(private authClient: FirebaseAuthClient) {}

  @withErrorHandling({
    errorMessage: "Error signing in:",
  })
  async signIn(request: SignInRequest): Promise<SignInResponse> {
    const user = await this.authClient.signIn(request);
    return { user };
  }

  @withErrorHandling({
    errorMessage: "Error signing up:",
  })
  async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    const user = await this.authClient.signUp(request);
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
  }

  @withErrorHandling({
    errorMessage: "Error logging out:",
  })
  async logout(): Promise<void> {
    await this.authClient.logout();
  }

  @withErrorHandling({
    errorMessage: "Error resetting password:",
  })
  async resetPassword(
    request: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    await this.authClient.resetPassword(request);
    return { success: true };
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return this.authClient.onAuthStateChange(callback);
  }

  @withErrorHandling({
    errorMessage: "User Not Logged in or not found",
  })
  getCurrentUser(): User {
    const user = this.getCurrentUserIfExists();
    if (!user) {
      throw new AuthError("User not found");
    }
    return user;
  }

  getCurrentUserIfExists(): User | undefined {
    return this.authClient.getCurrentUser();
  }
}
