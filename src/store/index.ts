import { configureStore } from "@reduxjs/toolkit";
import firebaseAuthReducer from "@/features/auth/store/slice";
import translationReducer from "@/features/translation/store/slice";
import reframingReducer from "@/features/reframing/store/slice";
import settingsReducer from "@/features/profile/store/slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Services } from "@/services/types";
import storage from "redux-persist/lib/storage";

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

// const persistConfig = {
//   key: "root",
//   storage,
//   whitelist: ["settings"],
// };

const reducers = {
  firebaseAuth: firebaseAuthReducer,
  translation: translationReducer,
  reframing: reframingReducer,
  settings: settingsReducer,
  auth: authReducer,
};
// const rootReducer = combineReducers(reducers);

// const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (
  services: Services,
  functions: InjectedFunctions
) => {
  return configureStore({
    reducer: reducers,
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
  });
};

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
