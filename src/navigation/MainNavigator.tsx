import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppNavigator } from "./AppNavigator";
import { NavigationProvider } from "@/features/navigation/NavigationContext";

export const MainNavigator = () => (
  <NavigationContainer>
    <NavigationProvider>
      <AppNavigator />
    </NavigationProvider>
  </NavigationContainer>
);
