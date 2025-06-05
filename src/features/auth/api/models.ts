import { User } from "firebase/auth";

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
