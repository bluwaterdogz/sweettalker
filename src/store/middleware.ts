import { Middleware } from "@reduxjs/toolkit";
import { Services } from "@/services/provider";

export const createServiceMiddleware = (services: Services): Middleware => {
  return (store) => (next) => (action) => {
    if (typeof action === "function") {
      return action(store.dispatch, store.getState, services);
    }
    return next(action);
  };
};
