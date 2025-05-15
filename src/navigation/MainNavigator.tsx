import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppNavigator } from "./AppNavigator";
import { NavigationProvider } from "@/features/navigation/components/NavigationContext";
import { SafeAreaView } from "react-native";

export const MainNavigator = () => (
  <SafeAreaView style={{ flex: 1 }}>
    <NavigationContainer>
      <NavigationProvider>
        <AppNavigator />
      </NavigationProvider>
    </NavigationContainer>
  </SafeAreaView>
);
