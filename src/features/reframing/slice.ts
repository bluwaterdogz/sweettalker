import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reframing } from "./api/models";
import { reframeText } from "./thunks";
import { ReframingModalityIdentifier } from "./enums";

interface ReframingState {
  inputText: string;
  reframings: Reframing[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedModalities: string[];
  conversationContext: string;
}

const initialState: ReframingState = {
  inputText:
    "Today was really hard, I went out to eat and ended up getting a bad vibe from the staff. I'm not sure if I'll ever go back there again.",
  reframings: [],
  status: "idle",
  error: null,
  selectedModalities: Object.values(ReframingModalityIdentifier),
  conversationContext: "",
};

const reframingSlice = createSlice({
  name: "reframing",
  initialState,
  reducers: {
    setInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
    clearInputText: (state) => {
      state.inputText = "";
    },
    setSelectedModalities: (state, action: PayloadAction<string[]>) => {
      state.selectedModalities = action.payload;
    },
    setConversationContext: (state, action: PayloadAction<string>) => {
      state.conversationContext = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Reframing cases
    builder
      .addCase(reframeText.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(reframeText.fulfilled, (state, action) => {
        state.status = "succeeded";
        const priorActiveReframings = state.reframings;
        state.reframings = [...action.payload, ...priorActiveReframings];
      })
      .addCase(reframeText.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as any;
      });
  },
});

export const {
  setInputText,
  clearInputText,
  setSelectedModalities,
  setConversationContext,
} = reframingSlice.actions;

export default reframingSlice.reducer;
