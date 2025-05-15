import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkAPI } from "@/store/types";
import { Reframing } from "./api/models";
import { Model } from "../common-interpretation/api/enums";

export const reframeText = createAsyncThunk<any, string, ThunkAPI>(
  "reframing/reframeText",
  async (input: string, { rejectWithValue, extra: { services } }) => {
    try {
      const model = Model.Gpt3_5;
      const reframings = await services.reframingService.reframeText({
        model,
        input,
      });

      console.log(reframings);
      await services.reframingService.persistUserMessageAndReframings(
        input,
        reframings,
        { model }
      );
      console.log(reframings);
      return reframings;
    } catch (error) {
      return rejectWithValue(error as Error);
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
      await services.reframingService.updateReframing(
        translation.id,
        translation
      );
    } catch (error) {
      // handleError(error, () => dispatch(updateReframing(translation)));
      return rejectWithValue(error as Error);
    }
  }
);

// export const updateReframingText = createAsyncThunk<
//   void,
//   { text: string; id: string },
//   ThunkAPI
// >(
//   "translation/updateReframingText",
//   async ({ id, text }, { rejectWithValue, extra: { services }, dispatch }) => {
//     try {
//       await services.reframingService.updateReframingText(id, text);
//     } catch (error) {
//       // TODO: handle retry
//       handleError(error, () => dispatch(updateReframingText({ id, text })));
//       return rejectWithValue(error as Error);
//     }
//   }
// );
