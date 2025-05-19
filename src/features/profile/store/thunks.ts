import { createAsyncThunk } from "@reduxjs/toolkit";
import { Settings } from "../api/models";
import { serializeError } from "@/services/base/errors/utils/serializeError";
import { ThunkAPI } from "@/store/types";
import { setSettings } from "./slice";
interface UpdateSettingsParams {
  settings: Partial<Settings>;
}
export const updateSettings = createAsyncThunk<
  void,
  UpdateSettingsParams,
  ThunkAPI
>(
  "settings/updateSettings",
  async (
    { settings }: UpdateSettingsParams,
    { rejectWithValue, extra: { services }, dispatch }
  ) => {
    try {
      dispatch(setSettings(settings));
      await services.profileService.updateSettings(settings);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
