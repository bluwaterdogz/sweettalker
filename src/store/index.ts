import { configureStore } from "@reduxjs/toolkit";
import firebaseAuthReducer from "@/features/firebase-auth/slice";
import translationReducer from "@/features/translation/slice";
import reframingReducer from "@/features/reframing/slice";
import voiceToTextReducer from "@/lib/voice-to-text/slice";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { Services } from "@/services/base/types";

export const createStore = (services: Services) => {
  return configureStore({
    reducer: {
      firebaseAuth: firebaseAuthReducer,
      translation: translationReducer,
      reframing: reframingReducer,
      voiceToText: voiceToTextReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { services },
        },
      }),
  });
};

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export interface ThunkAPI {
  state: RootState;
  dispatch: AppDispatch;
  rejectValue: string;
  extra: {
    services: Services;
  };
}

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppStore = () => {
  const store = useStore<RootState>();
  return store;
};
