import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  Translation,
  TranslationDTO,
} from "@common/models/translation/translation";
import { ThunkAPI } from "@/store/types";
import { Model } from "@common/types/model";
import { serializeError } from "@/services/base/errors/utils/serializeError";

export const translateText = createAsyncThunk<
  TranslationDTO[],
  { input: string },
  ThunkAPI
>(
  "translation/translateText",
  async ({ input }, { rejectWithValue, getState, extra: { services } }) => {
    try {
      const translations = await services.translationService.interpret({
        input,
        model: Model.Gpt35Turbo,
        options: {},
      });

      await services.translationService.createList(
        translations.map((t) => ({
          ...t,
          model: Model.Gpt35Turbo,
          input,
        }))
      );

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
