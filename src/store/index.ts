import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/slice";
import firebaseAuthReducer from "@/features/firebase-auth/slice";
import translationReducer from "@/features/translation/slice";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  useStore,
} from "react-redux";
import { Services } from "@/services/provider";

export const createStore = (services: Services) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      firebaseAuth: firebaseAuthReducer,
      translation: translationReducer,
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

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useAppStore = () => {
  const store = useStore<RootState>();
  return store;
};
