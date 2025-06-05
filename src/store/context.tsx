import { Provider } from "react-redux";
import { useServices } from "@/services/context";
import { createStore } from "./index";
import { useToast } from "@/common/components/Toast";
import { useMemo } from "react";
import { useConfirmation } from "@/common/components/Confirmation";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const services = useServices();
  const { showToast } = useToast();
  if (!services) {
    showToast({
      message: "Use StoreProvider within a ServicesProvider",
      type: "error",
    });
    return null;
  }
  const store = useMemo(() => createStore(services, {} as any), [services]);

  const persistor = useMemo(() => persistStore(store), [store]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};
