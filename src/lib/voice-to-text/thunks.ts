import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkAPI } from "@/store/types";

export const startVoiceInput = createAsyncThunk<void, void, ThunkAPI>(
  "reframing/startVoiceInput",
  async (_, { rejectWithValue }) => {
    try {
      // Implement voice input logic here
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);

export const stopVoiceInput = createAsyncThunk<void, void, ThunkAPI>(
  "reframing/stopVoiceInput",
  async (_, { rejectWithValue }) => {
    try {
      // Implement voice input stop logic here
    } catch (error) {
      return rejectWithValue(error as Error);
    }
  }
);
