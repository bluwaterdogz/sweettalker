import { createAsyncThunk } from "@reduxjs/toolkit";
import { CheckIn } from "@common/models/check-in/check-in";
import { ThunkAPI } from "@/store/types";
import { serializeError } from "@/services/base/errors/utils/serializeError";

export const checkIn = createAsyncThunk<void, any, ThunkAPI>(
  "checkIn/setCheckIn",
  async (checkIn: CheckIn, { rejectWithValue, extra: { services } }) => {
    try {
      await services.checkInService.update(
        checkIn.id || services.checkInService.getId(),
        checkIn
      );
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
