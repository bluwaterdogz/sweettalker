export enum ThemeLabel {
  dark = "dark",
  light = "light",
  main = "main",
}

export interface ThemeItem {
  primary: string;
  secondary: string;
  tertiary: string;
}

export type NeutralKeys =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

export interface ThemeColors {
  background: ThemeItem;
  text: ThemeItem;
  success: ThemeItem;
  error: ThemeItem;
  accent: ThemeItem;
  secondaryAccent: ThemeItem;
  shadow: ThemeItem;
  neutral: {
    [key in NeutralKeys]: string;
  };
  listItemColors: string[];
}

interface TypographyObject {
  fontSize: number;
  fontWeight: number;
}

export enum TypographyKeys {
  headingLarge = "headingLarge",
  headingMedium = "headingMedium",
  bodyLarge = "bodyLarge",
  bodyMedium = "bodyMedium",
  bodySmall = "bodySmall",
  labelLarge = "labelLarge",
  labelMedium = "labelMedium",
  labelSmall = "labelSmall",
}

export type ThemeTypography = {
  [K in TypographyKeys]: TypographyObject;
};

export interface Theme {
  colors: ThemeColors;
  typography: ThemeTypography;
}
