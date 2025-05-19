import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Modality, Translation } from "../api/models";
import { translateText } from "./thunks";

interface SerializableError {
  message: string;
  name: string;
  stack?: string;
}

interface TranslationState {
  translations: Translation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializableError | null;
  conversationContext: string;
  modalities: Modality[];
  tone: string | undefined;
}

const initialState: TranslationState = {
  translations: [],
  status: "idle",
  error: null,
  conversationContext: "",
  modalities: [],
  tone: undefined,
};

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    setConversationContext: (state, action: PayloadAction<string>) => {
      state.conversationContext = action.payload;
    },
    setModalities: (state, action: PayloadAction<Modality[]>) => {
      state.modalities = action.payload;
    },
    setTone: (state, action: PayloadAction<string>) => {
      state.tone = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Translation cases
    builder
      .addCase(translateText.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.status = "succeeded";
        const priorActiveTranslations = state.translations;
      })
      .addCase(translateText.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as SerializableError;
      });
  },
});

export const { setConversationContext, setModalities, setTone } =
  translationSlice.actions;

export default translationSlice.reducer;
