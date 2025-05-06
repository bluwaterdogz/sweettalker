import { createAsyncThunk } from "@reduxjs/toolkit";

import { authApi } from "@/services/axios";
import { User, Credentials, Tokens } from "./api/models";

export const login = createAsyncThunk<
  Tokens & { user: User },
  Credentials,
  { rejectValue: string }
>("auth/login", async (credentials: Credentials) => {
  const response = await authApi.post("/login", credentials);

  const { username, email, token, refresh } = response.data;
  return {
    token,
    refresh,
    user: {
      username,
      email,
    },
  };
});

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.post("/logout");
    return {};
  } catch (e) {
    throw "Logout Failed";
  }
});

export const register = createAsyncThunk<
  Tokens & { user: User },
  Credentials & { username: string },
  { rejectValue: string }
>("auth/register", async (credentials) => {
  try {
    const response = await authApi.post("/register", credentials);
    const { username, email, token, refresh } = response.data;

    return {
      token,
      refresh,
      user: {
        username,
        email,
      },
    };
  } catch (e) {
    console.log("Logout Failed", e);
    throw "Logout Failed";
  }
});

export const refresh = async (refresh: string) => {
  try {
    const response = await authApi.post("/refresh", { refresh });
    return response.data;
  } catch (e) {
    console.log("Refresh Failed", e);
    throw "Refresh Failed";
  }
};
