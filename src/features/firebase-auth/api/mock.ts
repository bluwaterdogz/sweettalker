import { User } from "./models";

const getEnv = (key: string, fallback: string) =>
  typeof process !== "undefined" && process.env && process.env[key]
    ? process.env[key]!
    : fallback;

export const mockUser: User = {
  uid: getEnv("EXPO_PUBLIC_MOCK_USER_UID", "mock-uid-123"),
  username: getEnv("EXPO_PUBLIC_MOCK_USER_USERNAME", "mockuser"),
  email: getEnv("EXPO_PUBLIC_MOCK_USER_EMAIL", "mockuser@example.com"),
  emailVerified:
    getEnv("EXPO_PUBLIC_MOCK_USER_EMAIL_VERIFIED", "true") === "true",
};

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
