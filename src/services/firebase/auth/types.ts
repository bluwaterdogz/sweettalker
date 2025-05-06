import { User, UserCredential } from "firebase/auth";
import { AuthError } from "../errors";

// Request types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest extends SignInRequest {
  displayName: string;
}

export interface ResetPasswordRequest {
  email: string;
}

// Response types
export interface SignInResponse {
  user: User;
}

export interface SignUpResponse {
  user: User;
}

export interface ResetPasswordResponse {
  success: boolean;
}

// Client interface
export interface AuthClient {
  signIn(request: SignInRequest): Promise<User>;
  signUp(request: SignUpRequest): Promise<User>;
  logout(): Promise<void>;
  resetPassword(request: ResetPasswordRequest): Promise<void>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}

// Service interface
export interface AuthService {
  signIn(request: SignInRequest): Promise<SignInResponse>;
  signUp(request: SignUpRequest): Promise<SignUpResponse>;
  logout(): Promise<void>;
  resetPassword(request: ResetPasswordRequest): Promise<ResetPasswordResponse>;
  onAuthStateChange(callback: (user: User | null) => void): () => void;
}
