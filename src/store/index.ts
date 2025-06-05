import { configureStore } from "@reduxjs/toolkit";
import firebaseAuthReducer from "@/features/auth/store/slice";
import translationReducer from "@/features/translation/store/slice";
import settingsReducer from "@/features/profile/store/slice";
import conversationReducer from "@/features/conversation/store/slice";
import { checkInReducer } from "@/features/check-in/store/store";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Services } from "@/services/types";

import { InjectedFunctions } from "./types";
import authReducer from "@/features/auth/store/slice";
import { combineReducers } from "@reduxjs/toolkit";
import {
  PERSIST,
  FLUSH,
  PAUSE,
  REGISTER,
  PURGE,
  persistReducer,
  REHYDRATE,
} from "redux-persist";

import AsyncStorage from "@react-native-async-storage/async-storage";

// Should show JSON data
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["settings"],
};

const reducers = {
  firebaseAuth: firebaseAuthReducer,
  translation: translationReducer,
  settings: settingsReducer,
  auth: authReducer,
  checkIn: checkInReducer,
  conversation: conversationReducer,
};
const rootReducer = combineReducers(reducers);

const persistedReducer = persistReducer(persistConfig, rootReducer);

const loggingMiddleware = (storeAPI: any) => (next: any) => (action: any) => {
  return next(action);
};

export const createStore = (
  services: Services,
  functions: InjectedFunctions
) => {
  return configureStore({
    reducer: persistedReducer, // reducer
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
        thunk: {
          extraArgument: {
            services,
            functions,
          },
        },
      }),
    // .concat(loggingMiddleware),
  });
};

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
