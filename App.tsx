import Toast from "react-native-toast-message";
import { MainNavigator } from "@/navigation/MainNavigator";
import { ToastProvider } from "@/lib/toast";
import { ThemeProvider } from "@/theme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "@/store/provider";
import { ServiceProvider } from "@/services/provider";
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
              <BillingProvider>
                <MainNavigator />
                <Toast />
              </BillingProvider>
            </StoreProvider>
          </ThemeProvider>
        </ServiceProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
