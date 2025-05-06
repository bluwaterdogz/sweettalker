const palette = {
  // Brand colors
  brand: {
    spaceCadet: "#222E50", // Deep blue-purple
    cerulean: "#007991", // Bright blue
    indianRed: "#EB5160", // Warm red
    celadon: "#BCD8C1", // Soft green
    antiflashWhite: "#EDF2F4", // Off-white
  },

  // Primary colors
  primary: {
    main: "#007991", // Using cerulean as secondary
    light: "#00A5C4",
    dark: "#005A6B",
  },

  // Secondary colors
  secondary: {
    main: "#222E50",
    light: "#2B3A66",
    dark: "#1A223D",
  },

  // Background colors
  background: {
    default: "#FFFFFF",
    paper: "#F5F5F5",
  },

  // Text colors
  text: {
    primary: "#000000",
    secondary: "#666666",
    light: "#FFFFFF",
  },

  // Status colors
  success: {
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
  },

  error: {
    main: "#F44336",
    light: "#E57373",
    dark: "#D32F2F",
  },

  // Accent colors
  accent: {
    purple: "#222E50", // Using spaceCadet
    orange: "#FF9800",
    pink: "#EB5160", // Using indianRed
    blue: "#007991", // Using cerulean
  },

  // Neutral colors
  neutral: {
    50: "#EDF2F4", // Using antiflashWhite
    100: "#E0E0E0",
    200: "#D0D0D0",
    300: "#B0B0B0",
    400: "#909090",
    500: "#707070",
    600: "#505050",
    700: "#303030",
    800: "#202020",
    900: "#101010",
  },

  // Special colors for relationship features
  relationship: {
    romantic: "#FF4081",
    platonic: "#7C4DFF",
    professional: "#00BCD4",
  },
} as const;

export const colors = {
  ...palette,
};

export type Colors = typeof colors;

export const darkPalette = {
  brand: {
    spaceCadet: "#222E50",
    cerulean: "#00A5C4",
    indianRed: "#EB5160",
    celadon: "#BCD8C1",
    antiflashWhite: "#EDF2F4",
  },
  primary: {
    main: "#00A5C4",
    light: "#00CFFF",
    dark: "#005A6B",
  },
  secondary: {
    main: "#EDF2F4",
    light: "#FFFFFF",
    dark: "#B0B0B0",
  },
  background: {
    default: "#181A20",
    paper: "#23262F",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#B0B0B0",
    light: "#EDF2F4",
  },
  success: {
    main: "#4CAF50",
    light: "#81C784",
    dark: "#388E3C",
  },
  error: {
    main: "#F44336",
    light: "#E57373",
    dark: "#D32F2F",
  },
  accent: {
    purple: "#7C4DFF",
    orange: "#FF9800",
    pink: "#EB5160",
    blue: "#00A5C4",
  },
  neutral: {
    50: "#23262F",
    100: "#30343D",
    200: "#3A3F4B",
    300: "#505463",
    400: "#707484",
    500: "#9094A5",
    600: "#B0B4C5",
    700: "#D0D4E5",
    800: "#E0E4F5",
    900: "#F5F6FA",
  },
  relationship: {
    romantic: "#FF4081",
    platonic: "#7C4DFF",
    professional: "#00BCD4",
  },
} as const;
