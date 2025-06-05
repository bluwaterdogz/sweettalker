import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkAPI } from "@/store/types";
import { Connection } from "@common/models/contacts/connection";
import { serializeError } from "@/services/base/errors/utils/serializeError";
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { BaseModel } from "@common/models/base/base";

interface CreateConnectionParams {
  requesterId: string;
  receiverId: string;
}

export const createConnection = createAsyncThunk<
  void,
  CreateConnectionParams,
  ThunkAPI
>(
  "connections/createConnection",
  async (
    { requesterId, receiverId },
    { rejectWithValue, extra: { services } }
  ) => {
    try {
      const userIds = [requesterId, receiverId].sort() as [string, string];
      const connection: Omit<Connection, keyof BaseModel> = {
        userIds,
        requesterId,
        receiverId,
        status: "pending",
      };
      await services.connectionService.create(connection);
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

interface UpdateConnectionParams {
  id: string;
  data: Partial<Connection>;
}

export const updateConnection = createAsyncThunk<
  Connection,
  UpdateConnectionParams,
  ThunkAPI
>(
  "connections/updateConnection",
  async ({ id, data }, { rejectWithValue, extra: { services } }) => {
    try {
      await services.connectionService.update(id, data);
      return { id, ...data } as Connection;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);

export const deleteConnection = createAsyncThunk<Connection, string, ThunkAPI>(
  "connections/deleteConnection",
  async (id, { rejectWithValue, extra: { services } }) => {
    try {
      await services.connectionService.delete(id);
      return { id } as Connection;
    } catch (error) {
      return rejectWithValue(serializeError(error));
    }
  }
);
// Add more thunks as needed (e.g., acceptConnection, rejectConnection)
