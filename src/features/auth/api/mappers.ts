import {
  User,
  Tokens,
  LoginResponse,
  UserApi,
  TokensApi,
  LoginApi,
  RegisterResponse,
  RegisterApi,
} from "./models";

// Mappers
export class UserMapper {
  static map(api: UserApi): User {
    return {
      username: api.username,
      email: api.email,
    };
  }
}

export class TokensMapper {
  static map(api: TokensApi): Tokens {
    return {
      token: api.token,
      refresh: api.refresh,
    };
  }
}

export class LoginMapper {
  static map(api: LoginApi): LoginResponse {
    return {
      user: UserMapper.map({
        username: api.username,
        email: api.email,
      }),
      tokens: TokensMapper.map({
        token: api.token,
        refresh: api.refresh,
      }),
    };
  }
}

export class RegisterMapper {
  static map(api: RegisterApi): RegisterResponse {
    return {
      user: UserMapper.map({
        username: api.username,
        email: api.email,
      }),
      tokens: TokensMapper.map({
        token: api.token,
        refresh: api.refresh,
      }),
    };
  }
}
