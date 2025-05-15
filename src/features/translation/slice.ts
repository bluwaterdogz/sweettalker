import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Translation } from "./api/models";
import { ModalityIdentifier } from "./enums";
import { translateText } from "./thunks";

interface TranslationState {
  inputText: string;
  translations: Translation[];
  pastTranslations: Translation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: Error | null;
  selectedModalities: string[];
  conversationContext: string;
}

const initialState: TranslationState = {
  inputText: "",
  translations: [],
  pastTranslations: [],
  status: "idle",
  error: null,
  selectedModalities: Object.values(ModalityIdentifier),
  conversationContext: "",
};

const translationSlice = createSlice({
  name: "translation",
  initialState,
  reducers: {
    setInputText: (state, action: PayloadAction<string>) => {
      state.inputText = action.payload;
    },
    addPastResponseItems: (state, action: PayloadAction<Translation[]>) => {
      state.pastTranslations = [...state.pastTranslations, ...action.payload];
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
    // Translation cases
    builder
      .addCase(translateText.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(translateText.fulfilled, (state, action) => {
        state.status = "succeeded";
        const priorActiveTranslations = state.translations;
        state.pastTranslations = [
          ...state.pastTranslations,
          ...priorActiveTranslations,
        ];
      })
      .addCase(translateText.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload instanceof Error
            ? action.payload
            : action.payload
            ? new Error(String(action.payload))
            : null;
      });
  },
});

export const {
  setInputText,
  addPastResponseItems,
  clearInputText,
  setSelectedModalities,
  setConversationContext,
} = translationSlice.actions;
export default translationSlice.reducer;
