import { createAsyncThunk } from "@reduxjs/toolkit";
import { RegisterCredentials } from "./api/models";
import { firebaseAuthService } from "./api/service";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { mapFirebaseUser } from "./api/mappers";
import { auth } from "@/firebase";

export const login = createAsyncThunk(
  "firebase-auth/login",
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return mapFirebaseUser(userCredential.user);
  }
);

export const register = createAsyncThunk(
  "firebaseAuth/register",
  async (credentials: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await firebaseAuthService.register(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk("firebase-auth/logout", async () => {
  await signOut(auth);
});
