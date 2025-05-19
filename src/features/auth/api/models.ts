import { User as FirebaseUser } from "firebase/auth";

// View Models
export interface User extends FirebaseUser {}

export interface Credentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends Credentials {
  username: string;
}

// Response Models
export interface LoginResponse {
  user: User;
}

export interface RegisterResponse {
  user: User;
}
