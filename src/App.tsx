import Toast from "react-native-toast-message";
import { MainNavigator } from "@/navigation/MainNavigator";
import { ToastProvider } from "@/common/features/Toast";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "@/store/context";
import { ServiceProvider } from "@/services/context";
import { enableMockAuth } from "@/features/auth/api/mock";
import { ConfirmationProvider } from "@/common/features/Confirmation/provider";
import { Confirmation } from "@/common/features/Confirmation";
import { I18nProvider } from "@/i18n/context";
import { ThemeProvider } from "@/common/theme/store/provider";
import "react-native-get-random-values";
import "./i18n";
export default function App() {
  // enableMockAuth();
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ConfirmationProvider>
          <ToastProvider>
            <ServiceProvider>
              <StoreProvider>
                <I18nProvider>
                  <Confirmation />
                  <MainNavigator />
                  <Toast />
                </I18nProvider>
              </StoreProvider>
            </ServiceProvider>
          </ToastProvider>
        </ConfirmationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
