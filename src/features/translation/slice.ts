import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Translation } from "./api/models";
import { ModalityIdentifier } from "./enums";
import { RootState } from "@/store";
import {
  translateText,
  validateMessage,
  startVoiceInput,
  stopVoiceInput,
} from "./thunks";

interface TranslationState {
  inputText: string;
  translations: Translation[];
  pastTranslations: Translation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isListening: boolean;
  selectedModalities: string[];
  conversationContext: string;
}

const initialState: TranslationState = {
  inputText: "",
  translations: [],
  pastTranslations: [],
  status: "idle",
  error: null,
  isListening: false,
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
        state.translations = action.payload;
      })
      .addCase(translateText.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
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

export { translateText, validateMessage, startVoiceInput, stopVoiceInput };
