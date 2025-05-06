import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "./api/models";
import { login, logout, register } from "./reducers";

interface FirebaseAuthState {
  user?: User;
  loading: boolean;
  error?: string;
}

const initialState: FirebaseAuthState = {
  user: undefined,
  loading: false,
  error: undefined,
};

export const firebaseAuthSlice = createSlice({
  name: "firebaseAuth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: User | undefined }>) => {
      state.user = action.payload.user;
      state.loading = false;
      state.error = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      });
  },
});

export const { setUser, clearError } = firebaseAuthSlice.actions;
export default firebaseAuthSlice.reducer;
