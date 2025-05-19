import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkAPI } from "@/store/types";
import { Reframing, ReframingModality } from "../api/models";
import { Model } from "@/features/common/api/enums";
import { serializeError } from "@/services/base/errors/utils/serializeError";

interface ReframeTextParams {
  input: string;
  options: {
    modality?: ReframingModality;
  };
}

export const reframeText = createAsyncThunk<any, ReframeTextParams, ThunkAPI>(
  "reframing/reframeText",
  async (
    { input, options }: ReframeTextParams,
    { rejectWithValue, extra: { services } }
  ) => {
    try {
      const model = Model.Gpt3_5;
      const reframings = await services.reframingService.interpret({
        model,
        input,
        options,
      });

      await services.reframingService.persist(reframings, {
        model,
        userText: input,
      });

      return reframings;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const updateReframing = createAsyncThunk<
  void,
  Partial<Reframing> & Pick<Reframing, "id">,
  ThunkAPI
>(
  "translation/updateReframing",
  async (
    translation: Partial<Reframing> & Pick<Reframing, "id">,
    { rejectWithValue, extra: { services }, dispatch }
  ) => {
    try {
      await services.reframingService.update(translation.id, translation);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const deleteReframing = createAsyncThunk<void, string, ThunkAPI>(
  "reframing/deleteReframing",
  async (id: string, { rejectWithValue, extra: { services } }) => {
    try {
      await services.reframingService.delete(id);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
