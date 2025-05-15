import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Translation, TranslationApi } from "./api/models";
import { ThunkAPI } from "@/store/types";
import { handleError } from "@/services/base/errors";
import { Model } from "../common-interpretation/api/enums";

export const translateText = createAsyncThunk<
  TranslationApi[],
  string,
  ThunkAPI
>(
  "translation/translateText",
  async (input: string, { rejectWithValue, extra: { services }, dispatch }) => {
    try {
      const model = Model.Gpt3_5;

      const translations = await services.translationService.translateText({
        model,
        input,
      });

      await services.translationService.persistUserMessageAndTranslations(
        input,
        translations,
        { model }
      );

      return translations;
    } catch (error) {
      handleError(error, () => dispatch(translateText(input)));
      return rejectWithValue(error as Error);
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
    { rejectWithValue, extra: { services }, dispatch }
  ) => {
    try {
      await services.translationService.updateTranslation(
        translation.id,
        translation
      );
    } catch (error) {
      handleError(error, () => dispatch(updateTranslation(translation)));
      return rejectWithValue(error as Error);
    }
  }
);

export const updateTranslationText = createAsyncThunk<
  void,
  { text: string; id: string },
  ThunkAPI
>(
  "translation/updateTranslationText",
  async ({ id, text }, { rejectWithValue, extra: { services }, dispatch }) => {
    try {
      await services.translationService.updateTranslationText(id, text);
    } catch (error) {
      // TODO: handle retry
      handleError(error, () => dispatch(updateTranslationText({ id, text })));
      return rejectWithValue(error as Error);
    }
  }
);
