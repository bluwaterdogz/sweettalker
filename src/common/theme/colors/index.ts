import { ThemeColors, ThemeLabel } from "../types";
import { mainPalette } from "./main";
import { lightPalette } from "./light";
import { darkPalette } from "./dark";

export const colors: { [key in ThemeLabel]: ThemeColors } = {
  main: mainPalette,
  light: lightPalette,
  dark: darkPalette,
};
