// View Models
export interface User {
  username: string;
  email: string;
}

export interface Tokens {
  token: string;
  refresh: string;
}

export interface Credentials {
  email: string;
  password: string;
}

// Response Models
export interface LoginResponse {
  user: User;
  tokens: Tokens;
}

export interface RegisterResponse {
  user: User;
  tokens: Tokens;
}

// API Models
export interface UserApi {
  username: string;
  email: string;
}

export interface TokensApi {
  token: string;
  refresh: string;
}

export interface LoginApi {
  username: string;
  email: string;
  token: string;
  refresh: string;
}

export interface RegisterApi {
  username: string;
  email: string;
  token: string;
  refresh: string;
}
