import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppNavigator } from "./AppNavigator";
import { SafeAreaView } from "react-native";
import { NavigationProvider } from "@/shared/components/Navigation/NavigationContext";
import { Host } from "react-native-portalize";

export const MainNavigator = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <Host>
      <NavigationContainer>
        <NavigationProvider>
          <AppNavigator />
        </NavigationProvider>
      </NavigationContainer>
    </Host>
  </SafeAreaView>
);
