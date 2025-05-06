import { Platform } from "react-native";

// Font families
export const fonts = {
  primary: Platform.select({
    ios: "System",
    android: "Roboto",
    default: "System",
  }),
  secondary: Platform.select({
    ios: "Avenir Next",
    android: "Roboto",
    default: "System",
  }),
  monospace: Platform.select({
    ios: "Menlo",
    android: "monospace",
    default: "monospace",
  }),
} as const;

// Font weights
export const fontWeights = {
  thin: "100",
  light: "300",
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  black: "900",
} as const;

// Font sizes
export const fontSizes = {
  // Display sizes
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,

  // Heading sizes
  headingLarge: 32,
  headingMedium: 28,
  headingSmall: 24,

  // Title sizes
  titleLarge: 22,
  titleMedium: 20,
  titleSmall: 18,

  // Body sizes
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,

  // Label sizes
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
} as const;

// Line heights
export const lineHeights = {
  displayLarge: 64,
  displayMedium: 52,
  displaySmall: 44,

  headingLarge: 40,
  headingMedium: 36,
  headingSmall: 32,

  titleLarge: 28,
  titleMedium: 26,
  titleSmall: 24,

  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 16,

  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 14,
} as const;

// Letter spacing
export const letterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
} as const;

// Typography styles
export const typography = {
  displayLarge: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.displayLarge,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.displayLarge,
    letterSpacing: letterSpacing.normal,
  },
  displayMedium: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.displayMedium,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.displayMedium,
    letterSpacing: letterSpacing.normal,
  },
  displaySmall: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.displaySmall,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.displaySmall,
    letterSpacing: letterSpacing.normal,
  },

  headingLarge: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.headingLarge,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.headingLarge,
    letterSpacing: letterSpacing.tight,
  },
  headingMedium: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.headingMedium,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.headingMedium,
    letterSpacing: letterSpacing.tight,
  },
  headingSmall: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.headingSmall,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.headingSmall,
    letterSpacing: letterSpacing.tight,
  },

  titleLarge: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.titleLarge,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.titleLarge,
    letterSpacing: letterSpacing.normal,
  },
  titleMedium: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.titleMedium,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.titleMedium,
    letterSpacing: letterSpacing.normal,
  },
  titleSmall: {
    fontFamily: fonts.primary,
    fontSize: fontSizes.titleSmall,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.titleSmall,
    letterSpacing: letterSpacing.normal,
  },

  bodyLarge: {
    fontFamily: fonts.secondary,
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodyLarge,
    letterSpacing: letterSpacing.normal,
  },
  bodyMedium: {
    fontFamily: fonts.secondary,
    fontSize: fontSizes.bodyMedium,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodyMedium,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontFamily: fonts.secondary,
    fontSize: fontSizes.bodySmall,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodySmall,
    letterSpacing: letterSpacing.normal,
  },

  labelLarge: {
    fontFamily: fonts.secondary,
    fontSize: fontSizes.labelLarge,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.labelLarge,
    letterSpacing: letterSpacing.wide,
  },
  labelMedium: {
    fontFamily: fonts.secondary,
    fontSize: fontSizes.labelMedium,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.labelMedium,
    letterSpacing: letterSpacing.wide,
  },
  labelSmall: {
    fontFamily: fonts.secondary,
    fontSize: fontSizes.labelSmall,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.labelSmall,
    letterSpacing: letterSpacing.wide,
  },
} as const;

export type Typography = typeof typography;
