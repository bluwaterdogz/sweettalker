import { useMemo } from "react";
import { useTheme } from "./useTheme";
import { ThemeLabel } from "../../../../../common/src/types/theme/types";
import { StyleProp } from "react-native";

export const useThemeSpecificStyles = (
  styleMap: Partial<{
    [key in ThemeLabel]: StyleProp<any>;
  }>
): StyleProp<any> => {
  const { theme } = useTheme();
  return useMemo(() => styleMap[theme] || {}, [theme]);
};
