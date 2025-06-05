import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterCredentials, RegisterResponse } from "../api/models";
import { ThunkAPI } from "@/store/types";
import { serializeError } from "@/services/base/errors/utils/serializeError";

export const login = createAsyncThunk<
  { user: any },
  { email: string; password: string },
  ThunkAPI
>(
  "auth/login",
  async ({ email, password }, { rejectWithValue, extra: { services } }) => {
    try {
      const response = await services.authService.login({ email, password });
      return response;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const register = createAsyncThunk<
  RegisterResponse,
  RegisterCredentials,
  ThunkAPI
>(
  "auth/register",
  async (
    credentials: RegisterCredentials,
    { rejectWithValue, extra: { services } }
  ) => {
    try {
      const response = await services.authService.register(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const logout = createAsyncThunk<void, void, ThunkAPI>(
  "auth/logout",
  async (_, { rejectWithValue, extra: { services } }) => {
    try {
      await services.authService.logout();
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
