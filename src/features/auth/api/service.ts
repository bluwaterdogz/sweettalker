import { AuthClient } from "./client";
import {
  UserMapper,
  TokensMapper,
  LoginMapper,
  RegisterMapper,
} from "./mappers";
import { LoginResponse, User, Tokens, RegisterResponse } from "./models";
import {
  LoginParams,
  RegisterParams,
  RefreshTokenParams,
  FetchUserParams,
} from "./client";

export class AuthService {
  private client: AuthClient;

  constructor(client: AuthClient) {
    this.client = client;
  }

  async login(params: LoginParams): Promise<LoginResponse> {
    try {
      const response = await this.client.login(params);
      return LoginMapper.map(response);
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  }

  async register(params: RegisterParams): Promise<RegisterResponse> {
    try {
      const response = await this.client.register(params);
      return RegisterMapper.map(response);
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.logout();
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async refreshToken(params: RefreshTokenParams): Promise<Tokens> {
    try {
      const response = await this.client.refreshToken(params);
      return TokensMapper.map(response);
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  async fetchUser(params: FetchUserParams): Promise<User | undefined> {
    try {
      const response = await this.client.fetchUser(params);
      if (response) {
        return UserMapper.map(response);
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
}
