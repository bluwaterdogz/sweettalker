import React, { useMemo } from "react";
import { Provider } from "react-redux";
import { useServices } from "@/services/provider";
import { createStore } from "./index";
import { useToast } from "@/lib/toast";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const services = useServices();
  const toast = useToast();
  if (!services) {
    toast.showToast({
      message: "Use ServicesProvider before using StoreProvider",
      type: "error",
    });
    return null;
  }
  const store = useMemo(() => createStore(services), [services]);

  return <Provider store={store}>{children}</Provider>;
};
