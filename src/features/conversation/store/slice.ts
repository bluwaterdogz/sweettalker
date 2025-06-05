import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation } from "@common/models/chat";
import {
  deleteConversation,
  addConversation,
  updateConversation,
} from "./thunks";
interface ConversationState {
  conversations: Conversation[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  conversationContext: string;
}

const initialState: ConversationState = {
  conversations: [],
  status: "idle",
  error: null,
  conversationContext: "",
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setConversationInput: (
      state,
      action: PayloadAction<{ id: string; userInput: string }>
    ) => {
      state.conversations = state.conversations.map((c: Conversation) => {
        if (c.id === action.payload.id) {
          return { ...c, userInput: action.payload.userInput };
        }
        return c;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addConversation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addConversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations.push(action.payload);
      })
      .addCase(addConversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ? String(action.payload) : "Unknown error";
      })
      .addCase(updateConversation.fulfilled, (state, action) => {
        const index = state.conversations.findIndex(
          (c: Conversation) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            ...action.payload,
          };
        }
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (c: Conversation) => c.id !== action.payload
        );
      });
  },
});

export const { setConversationInput } = conversationSlice.actions;
export default conversationSlice.reducer;
