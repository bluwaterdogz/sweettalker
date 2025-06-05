import { lightPalette } from "./light";
import { darkPalette } from "./dark";
import { ThemeColors } from "../types";
import { ThemeLabel } from "../types";

export const colors: { [key in ThemeLabel]: ThemeColors } = {
  main: lightPalette,
  light: lightPalette,
  dark: darkPalette,
};
