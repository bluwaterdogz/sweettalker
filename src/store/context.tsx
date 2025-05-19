import { Provider } from "react-redux";
import { useServices } from "@/services/context";
import { createStore } from "./index";
import { useToast } from "@/common/features/Toast";
import { useMemo } from "react";
import { useTheme } from "@/common/theme/hooks/useTheme";
import { useConfirmation } from "@/common/features/Confirmation";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setTheme } = useTheme();
  const services = useServices();
  const confirm = useConfirmation();
  const { showToast } = useToast();
  if (!services) {
    showToast({
      message: "Use StoreProvider within a ServicesProvider",
      type: "error",
    });
    return null;
  }
  const store = useMemo(
    () => createStore(services, { setTheme, confirm, showToast }),
    [services, setTheme, confirm, showToast]
  );

  // const persistor = useMemo(() => persistStore(store), [store]);

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      {children}
      {/* </PersistGate> */}
    </Provider>
  );
};
