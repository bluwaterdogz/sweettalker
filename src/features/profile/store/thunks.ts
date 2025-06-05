import { createAsyncThunk } from "@reduxjs/toolkit";
import { Settings } from "@sweettalker/common/src/models/profile/settings";
import { serializeError } from "@/services/base/errors/utils/serializeError";
import { ThunkAPI } from "@/store/types";

export const updateSettings = createAsyncThunk<
  void,
  Partial<Settings>,
  ThunkAPI
>(
  "settings/updateSettings",
  async (
    settings: Partial<Settings>,
    { rejectWithValue, extra: { services } }
  ) => {
    try {
      await services.profileService.update("", settings);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
