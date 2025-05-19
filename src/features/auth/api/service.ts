import { FirebaseAuthService } from "@/services/firebase/auth";
import { SignInRequest, SignUpRequest } from "@/services/firebase/auth/types";
import {
  Credentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
  User,
} from "./models";
import { mapFirebaseUser } from "./mappers";
import { isMockAuthEnabled, mockUser } from "./mock";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";

export class AuthService {
  constructor(private firebaseAuthService: FirebaseAuthService) {}

  @withErrorHandling({
    errorMessage: "Error logging in:",
  })
  async login(credentials: Credentials): Promise<LoginResponse> {
    if (isMockAuthEnabled()) {
      return { user: mockUser };
    }
    const signInRequest: SignInRequest = {
      email: credentials.email,
      password: credentials.password,
    };
    const response = await this.firebaseAuthService.signIn(signInRequest);
    return {
      user: mapFirebaseUser(response.user),
    };
  }

  @withErrorHandling({
    errorMessage: "Error registering:",
  })
  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    if (isMockAuthEnabled()) {
      return { user: mockUser };
    }
    const signUpRequest: SignUpRequest = {
      email: credentials.email,
      password: credentials.password,
      displayName: credentials.username,
    };
    const response = await this.firebaseAuthService.signUp(signUpRequest);
    return {
      user: mapFirebaseUser(response.user),
    };
  }

  @withErrorHandling({
    errorMessage: "Error logging out:",
  })
  async logout(): Promise<void> {
    if (isMockAuthEnabled()) {
      return;
    }
    await this.firebaseAuthService.logout();
  }

  onAuthStateChanged(
    callback: (user: LoginResponse | null) => void
  ): () => void {
    if (isMockAuthEnabled()) {
      callback({ user: mockUser });
      return () => {};
    }
    return this.firebaseAuthService.onAuthStateChange((firebaseUser) => {
      callback(firebaseUser ? { user: mapFirebaseUser(firebaseUser) } : null);
    });
  }

  getCurrentUser(): User {
    if (isMockAuthEnabled()) {
      return mockUser;
    }
    return this.firebaseAuthService.getCurrentUser();
  }

  getCurrentUserIfExists(): User | undefined {
    if (isMockAuthEnabled()) {
      return mockUser;
    }
    return this.firebaseAuthService.getCurrentUserIfExists();
  }
}
