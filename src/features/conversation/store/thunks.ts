import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkAPI } from "@/store/types";
import { Conversation, ConversationMapper } from "@common/models/chat";
import { serializeError } from "@/services/base/errors/utils/serializeError";

interface CreateConversationParams {
  userIds: string[];
}

export const addConversation = createAsyncThunk<
  Conversation,
  CreateConversationParams,
  ThunkAPI
>(
  "conversation/addConversation",
  async (
    params: CreateConversationParams,
    { rejectWithValue, extra: { services } }
  ) => {
    const { userIds } = params;
    try {
      const conversation = {
        userIds,
        options: {},
      };
      const convo = await services.conversationService.create(conversation);
      return ConversationMapper.map(convo);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const updateConversation = createAsyncThunk<
  void,
  Partial<Conversation> & Pick<Conversation, "id">,
  ThunkAPI
>(
  "conversation/updateConversation",
  async (
    conversation: Partial<Conversation> & Pick<Conversation, "id">,
    { rejectWithValue, extra: { services } }
  ) => {
    try {
      await services.conversationService.update(conversation.id, conversation);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const deleteConversation = createAsyncThunk<string, string, ThunkAPI>(
  "conversation/deleteConversation",
  async (id: string, { rejectWithValue, extra: { services } }) => {
    try {
      await services.conversationService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

interface SendMessageParams {
  conversationId: string;
  input: string;
}

export const sendMessage = createAsyncThunk<void, SendMessageParams, ThunkAPI>(
  "conversation/sendMessage",
  async (
    params: SendMessageParams,
    { rejectWithValue, extra: { services } }
  ) => {
    const { conversationId, input } = params;
    try {
      await services.messageService.sendMessage({
        conversationId,
        input,
      });
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
