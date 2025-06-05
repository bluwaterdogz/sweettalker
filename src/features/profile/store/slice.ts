import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Model } from "@common/types/model";

interface SettingsState {
  model: Model;
  notifications: boolean;
  loading: boolean;
  storeReady: boolean;
  initialized: boolean;
  safeChat: boolean;
  blockedUsers: string[];
}

const initialState: SettingsState = {
  model: Model.Gpt35Turbo,
  notifications: true,
  loading: false,
  storeReady: false,
  initialized: false,
  safeChat: false,
  blockedUsers: [],
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,

  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      const { model, notifications, safeChat, blockedUsers } = action.payload;
      Object.assign(state, { model, notifications, safeChat, blockedUsers });

      // state.loading = true;
      if (action.payload.model !== undefined) {
        state.model = action.payload.model;
      }
      if (action.payload.notifications !== undefined) {
        state.notifications = action.payload.notifications;
      }
      if (action.payload.safeChat !== undefined) {
        state.safeChat = action.payload.safeChat;
      }
      // state.loading = false;
      // state.initialized = true;
    },
    setStoreReady: (state, action: PayloadAction<boolean>) => {
      state.storeReady = action.payload;
    },
    resetSettings: (state) => {
      return { ...initialState };
    },
  },
});

export const { setSettings, setStoreReady, resetSettings } =
  settingsSlice.actions;
export default settingsSlice.reducer;
