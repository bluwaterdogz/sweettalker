import { User } from "firebase/auth";

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
