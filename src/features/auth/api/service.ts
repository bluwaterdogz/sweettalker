import { FirebaseAuthService } from "@/services/firebase/auth";
import { SignInRequest, SignUpRequest } from "@/services/firebase/auth/types";
import {
  Credentials,
  LoginResponse,
  RegisterCredentials,
  RegisterResponse,
} from "./models";
import { mapFirebaseUser } from "./mappers";
import { isMockAuthEnabled, mockUser } from "./mock";
import { withErrorHandling } from "@/services/base/errors/utils/withErrorHandling";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/app/firebase";
import { serverTimestamp } from "firebase/firestore";
import { User } from "firebase/auth";

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
    await this.syncUserDocument(response.user);
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
    await this.syncUserDocument(response.user);
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
      if (firebaseUser) {
        this.syncUserDocument(firebaseUser).catch(console.error);
      }
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

  private async syncUserDocument(user: User): Promise<void> {
    const userRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userRef);

    const userData = {
      email: user.email,
      searchableEmail: user.email?.toLowerCase(),
      displayName: user.displayName,
      photoURL: user.photoURL,
      updatedAt: serverTimestamp(),
    };

    if (!userDoc.exists()) {
      // Create new user document if it doesn't exist
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
      });
    } else {
      // Update existing document if any properties have changed
      const existingData = userDoc.data();
      const hasChanges = Object.entries(userData).some(
        ([key, value]) => existingData[key] !== value
      );

      if (hasChanges) {
        await setDoc(userRef, userData, { merge: true });
      }
    }
  }
}
