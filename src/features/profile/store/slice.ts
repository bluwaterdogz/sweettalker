import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Model } from "@/features/common/api/enums";

interface SettingsState {
  model: Model;
  notifications: boolean;
  loading: boolean;
  storeReady: boolean;
  initialized: boolean;
}

const initialState: SettingsState = {
  model: Model.Gpt3_5,
  notifications: true,
  loading: false,
  storeReady: false,
  initialized: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
      const { model, notifications } = action.payload;
      Object.assign(state, { model, notifications });

      // state.loading = true;
      // if (action.payload.model !== undefined) {
      //   state.model = action.payload.model;
      // }
      // if (action.payload.notifications !== undefined) {
      //   state.notifications = action.payload.notifications;
      // }
      // if (action.payload.language !== undefined) {
      //   state.language = action.payload.language;
      // }
      // state.loading = false;
      // state.initialized = true;
    },
    checkStoreState: (state) => {
      console.log("🧠 checkStoreState called", state);
    },
    setStoreReady: (state, action: PayloadAction<boolean>) => {
      state.storeReady = action.payload;
    },
    resetSettings: (state) => {
      return { ...initialState };
    },
  },
});

export const { setSettings, setStoreReady, resetSettings, checkStoreState } =
  settingsSlice.actions;
export default settingsSlice.reducer;
