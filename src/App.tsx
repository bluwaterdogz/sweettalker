import Toast from "react-native-toast-message";
import { MainNavigator } from "@/app/navigation/MainNavigator";
import { ToastProvider } from "@/common/components/Toast";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider } from "@/store/context";
import { ServiceProvider } from "@/services/context";
import { ConfirmationProvider } from "@/common/components/Confirmation/provider";
import { Confirmation } from "@/common/components/Confirmation";
import { ThemeProvider } from "@/common/theme/store/provider";
import { TranslationProvider } from "./i18n/context/TranslationProvider";
import "react-native-get-random-values";
import "./i18n";
import { Text } from "react-native";
export default function App() {
  // enableMockAuth();
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TranslationProvider>
          <ConfirmationProvider>
            <ToastProvider>
              <ServiceProvider>
                <StoreProvider>
                  <Confirmation />
                  <MainNavigator />
                  <Toast />
                </StoreProvider>
              </ServiceProvider>
            </ToastProvider>
          </ConfirmationProvider>
        </TranslationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
