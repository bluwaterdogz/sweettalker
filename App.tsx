import Toast from "react-native-toast-message";
import { MainNavigator } from "@/navigation/MainNavigator";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider } from "@/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "@/store/context";
import { ServiceProvider } from "@/services/context";
import { BillingProvider } from "@/features/billing/context/BillingContext";
import { enableMockAuth } from "@/features/firebase-auth/api/mock";

export default function App() {
  enableMockAuth();
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <ServiceProvider>
          <ThemeProvider>
            <StoreProvider>
              <MainNavigator />
              <Toast />
            </StoreProvider>
          </ThemeProvider>
        </ServiceProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
