import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Modality } from "@common/models/translation/translation-modality";
import { Translation } from "@common/models/translation/translation";
import { translateText } from "./thunks";
import { SerializableError } from "@/store/types";

interface TranslationFilters {
  search?: string;
  showOnlyFavorites?: boolean;
}

interface TranslationState {
  translations: Translation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializableError | null;
  conversationContext: string;
  modalities: Modality[];
  tone: string | undefined;
  filters: TranslationFilters;
}

const initialState: TranslationState = {
  translations: [],
  status: "idle",
  error: null,
  conversationContext: "",
  modalities: [],
  tone: undefined,
  filters: {
    search: "",
    showOnlyFavorites: false,
  },
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
    setTone: (state, action: PayloadAction<string | undefined>) => {
      state.tone = action.payload;
    },
    setFilters: (state, action: PayloadAction<TranslationFilters>) => {
      Object.assign(state.filters, action.payload);
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

export const { setConversationContext, setModalities, setTone, setFilters } =
  translationSlice.actions;

export default translationSlice.reducer;
