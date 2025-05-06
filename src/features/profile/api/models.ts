// View Models
export interface UserProfile {
  id: string;
  displayName: string;
  bio?: string;
  photoUrl?: string;
  location?: string;
  website?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  autoTranslate?: boolean;
  defaultLanguage?: string;
  defaultModel?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// API Models - Data from Firestore
export interface UserProfileApi {
  id: string;
  displayName: string;
  bio?: string;
  photoUrl?: string;
  location?: string;
  website?: string;
  createdAt: Date | any; // Firestore Timestamp
  updatedAt: Date | any; // Firestore Timestamp
}

export interface UserSettingsApi {
  id: string;
  userId: string;
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  autoTranslate?: boolean;
  defaultLanguage?: string;
  defaultModel?: string;
  createdAt: Date | any; // Firestore Timestamp
  updatedAt: Date | any; // Firestore Timestamp
}

export interface SubscriptionOptions {
  onError?: (error: Error) => void;
  setLoading?: (loading: boolean) => void;
}
