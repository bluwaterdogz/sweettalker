import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  Translation,
  TranslationApi,
} from "@/features/translation/api/models";
import { ThunkAPI } from "@/store/types";
import { Model } from "@/features/common/api/enums";
import { serializeError } from "@/services/base/errors/utils/serializeError";

interface TranslateTextParams {
  input: string;
}

export const translateText = createAsyncThunk<
  TranslationApi[],
  TranslateTextParams,
  ThunkAPI
>(
  "translation/translateText",
  async ({ input }, { rejectWithValue, getState, extra: { services } }) => {
    try {
      const model = Model.Gpt3_5;
      const { translation } = getState();
      const translations = await services.translationService.interpret({
        model,
        input,
        options: {
          modalities: translation.modalities,
          tone: translation.tone,
          // userInstructions: translation.userInstructions,
          // extraContext: translation.extraContext,
        },
      });

      await services.translationService.persist(translations, {
        model,
        userText: input,
      });

      return translations;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const updateTranslation = createAsyncThunk<
  void,
  Partial<Translation> & Pick<Translation, "id">,
  ThunkAPI
>(
  "translation/updateTranslation",
  async (
    translation: Partial<Translation> & Pick<Translation, "id">,
    { rejectWithValue, extra: { services } }
  ) => {
    try {
      await services.translationService.update(translation.id, translation);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const updateTranslationText = createAsyncThunk<
  void,
  { text: string; id: string },
  ThunkAPI
>(
  "translation/updateTranslationText",
  async ({ id, text }, { rejectWithValue, extra: { services } }) => {
    try {
      await services.translationService.updateTranslationText(id, text);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const deleteTranslation = createAsyncThunk<void, string, ThunkAPI>(
  "translation/deleteTranslation",
  async (id: string, { rejectWithValue, extra: { services } }) => {
    try {
      await services.translationService.delete(id);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
