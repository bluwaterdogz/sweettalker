import { authApi } from "@/services/axios";
import { LoginApi, RegisterApi, TokensApi, UserApi } from "./models";

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  username: string;
}

export interface RefreshTokenParams {
  refresh: string;
}

export interface FetchUserParams {
  token: string;
}

export class AuthClient {
  async login(params: LoginParams): Promise<LoginApi> {
    const response = await authApi.post("/login", params);
    return response.data;
  }

  async register(params: RegisterParams): Promise<RegisterApi> {
    const response = await authApi.post("/register", params);
    return response.data;
  }

  async logout(): Promise<void> {
    await authApi.post("/logout");
  }

  async refreshToken(params: RefreshTokenParams): Promise<TokensApi> {
    const response = await authApi.post("/refresh", params);
    return response.data;
  }

  async fetchUser(params: FetchUserParams): Promise<UserApi | undefined> {
    const response = await authApi.get("/me", {
      headers: {
        Authorization: `Bearer ${params.token}`,
      },
    });
    return response.data;
  }
}
