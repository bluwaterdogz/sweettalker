import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Reframing, ReframingModality } from "../api/models";
import { deleteReframing, reframeText } from "./thunks";
import { ReframingModalityIdentifier } from "../enums";
import { reframingModalities } from "../consts";

interface ReframingState {
  reframings: Reframing[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedModalities: string[];
  conversationContext: string;
  modality: ReframingModality;
}

const initialState: ReframingState = {
  reframings: [],
  status: "idle",
  error: null,
  selectedModalities: Object.values(ReframingModalityIdentifier),
  conversationContext: "",
  modality:
    reframingModalities[ReframingModalityIdentifier.COGNITIVE_REFRAMING],
};

const reframingSlice = createSlice({
  name: "reframing",
  initialState,
  reducers: {
    setSelectedModalities: (state, action: PayloadAction<string[]>) => {
      state.selectedModalities = action.payload;
    },
    setConversationContext: (state, action: PayloadAction<string>) => {
      state.conversationContext = action.payload;
    },
    setModality: (state, action: PayloadAction<ReframingModality>) => {
      state.modality = action.payload;
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
      })
      .addCase(deleteReframing.pending, (state) => {
        // TODO change to deleting
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteReframing.fulfilled, (state, action) => {})
      .addCase(deleteReframing.rejected, (state, action) => {
        state.error = action.payload as any;
      });
  },
});

export const { setSelectedModalities, setConversationContext, setModality } =
  reframingSlice.actions;

export default reframingSlice.reducer;
