import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

interface ReframingState {
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isListening: boolean;
}

const initialState: ReframingState = {
  status: "idle",
  error: null,
  isListening: false,
};

const voiceToTextSlice = createSlice({
  name: "voiceToText",
  initialState,
  reducers: {
    setIsListening: (state, action: PayloadAction<boolean>) => {
      state.isListening = action.payload;
    },
  },
});

export const { setIsListening } = voiceToTextSlice.actions;

export default voiceToTextSlice.reducer;
