import { User } from "./models";

const getEnv = (key: string, fallback: string) =>
  typeof process !== "undefined" && process.env && process.env[key]
    ? process.env[key]!
    : fallback;

export const mockUser: User = {
  uid: getEnv("EXPO_PUBLIC_MOCK_USER_UID", "mock-uid-123"),
  displayName: getEnv("EXPO_PUBLIC_MOCK_USER_DISPLAY_NAME", "Mockuser"),
  photoURL: getEnv(
    "EXPO_PUBLIC_MOCK_USER_PHOTO_URL",
    "https://randomuser.me/api/portraits/men/75.jpg"
  ),
  email: getEnv("EXPO_PUBLIC_MOCK_USER_EMAIL", "mockuser@example.com"),
  emailVerified:
    getEnv("EXPO_PUBLIC_MOCK_USER_EMAIL_VERIFIED", "true") === "true",
  isAnonymous: false,
  metadata: {
    creationTime: "2021-01-01T00:00:00Z",
    lastSignInTime: "2021-01-01T00:00:00Z",
  },
  providerData: [],
  refreshToken: "mock-refresh-token",
  tenantId: "mock-tenant-id",
} as unknown as User;

let mockEnabled = false;

export function enableMockAuth() {
  mockEnabled = true;
}
export function disableMockAuth() {
  mockEnabled = false;
}
export function isMockAuthEnabled() {
  return mockEnabled;
}

export const mockAuth = {
  currentUser: mockUser,
  signIn: async () => mockUser,
  signOut: async () => {},
  isAuthenticated: () => true,
};
