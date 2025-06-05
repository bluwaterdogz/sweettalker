import { createSlice } from "@reduxjs/toolkit";
import { Emotion, Need } from "../types";

interface CheckInState {
  emotions: Emotion[];
  needs: Need[];
}

const initialState: CheckInState = {
  emotions: [],
  needs: [],
};

const checkInSlice = createSlice({
  name: "checkIn",
  initialState,
  reducers: {
    setCheckIn: (state, action) => {
      state.emotions = action.payload.emotions;
      state.needs = action.payload.needs;
    },
    setEmotions: (state, action) => {
      state.emotions = action.payload;
    },
    setNeeds: (state, action) => {
      state.needs = action.payload;
    },
  },
});

export const { setEmotions, setNeeds, setCheckIn } = checkInSlice.actions;
export const checkInReducer = checkInSlice.reducer;
