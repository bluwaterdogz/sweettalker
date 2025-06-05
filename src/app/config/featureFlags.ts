export const FEATURE_FLAGS = {
  USE_FIREBASE_AUTH: true, // Set to true to use Firebase auth, false to use existing auth
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FEATURE_FLAGS[flag];
};
