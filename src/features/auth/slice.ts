import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  PayloadAction,
} from "@reduxjs/toolkit";

import { login, logout, register } from "./reducers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { REFRESH_KEY, TOKEN_KEY } from "./consts";
import { Tokens, User } from "./api/models";

interface AuthState {
  user?: User;
  token?: string;
  refresh?: string;
  loading: boolean;
  error?: string;
}

const initialState: AuthState = {
  user: undefined,
  loading: false,
  error: undefined,
  token: undefined,
  refresh: undefined,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,

  reducers: {
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      const { user } = action.payload;
      Object.assign(state, { user });
    },
    setTokens: (
      state,
      action: PayloadAction<{ token: string; refresh: string }>
    ) => {
      const { token, refresh } = action.payload;
      // TODO : possible race condition?
      Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, token),
        AsyncStorage.setItem(REFRESH_KEY, refresh),
      ]);
      Object.assign(state, { token, refresh });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<Tokens & { user: User }>) => {
          Object.assign(state, {
            token: action.payload.token,
            refresh: action.payload.refresh,
            user: action.payload.user,
          });
        }
      )
      .addCase(logout.fulfilled, (state) => {
        Object.assign(state, initialState);
        Promise.all([
          AsyncStorage.removeItem(TOKEN_KEY),
          AsyncStorage.removeItem(REFRESH_KEY),
        ]);
      })
      .addMatcher(isPending(login, logout, register), (state) => {
        Object.assign(state, {
          loading: true,
          error: undefined,
        });
      })
      .addMatcher(isFulfilled(login, logout, register), (state) => {
        Object.assign(state, {
          loading: false,
          error: undefined,
        });
      })
      .addMatcher(isRejected(login, logout, register), (state) => {
        const { error: _error, ...rest } = initialState;
        Object.assign(state, rest);
        state.error = "Request failed";
      });
  },
});

export default authSlice.reducer;
export const { setUser, setTokens } = authSlice.actions;
