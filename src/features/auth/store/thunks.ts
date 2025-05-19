import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterCredentials, RegisterResponse } from "../api/models";

import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { mapFirebaseUser } from "../api/mappers";
import { auth } from "@/firebase";
import { ThunkAPI } from "@/store/types";
import { serializeError } from "@/services/base/errors/utils/serializeError";

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return mapFirebaseUser(userCredential.user);
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

export const logout = createAsyncThunk("firebase-auth/logout", async () => {
  await signOut(auth);
});
