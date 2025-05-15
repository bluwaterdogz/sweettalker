import { Provider } from "react-redux";
import { useServices } from "@/services/context";
import { createStore } from "./index";
import { useToast } from "@/lib/toast";
import { useMemo } from "react";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const services = useServices();
  const toast = useToast();
  if (!services) {
    toast.showToast({
      message: "Use StoreProvider within a ServicesProvider",
      type: "error",
    });
    return null;
  }
  const store = useMemo(() => createStore(services), [services]);

  return <Provider store={store}>{children}</Provider>;
};
