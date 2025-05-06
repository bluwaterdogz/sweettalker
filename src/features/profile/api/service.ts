import { FirebaseService } from "@/services/firebase/types";
import { FirestoreCollections } from "@/store/collections";
import { firebaseAuthService } from "@/features/firebase-auth/api/service";
import {
  UserProfile,
  UserProfileApi,
  UserSettings,
  UserSettingsApi,
  SubscriptionOptions,
} from "./models";
import { UserProfileMapper, UserSettingsMapper } from "./mappers";

export class ProfileService {
  constructor(private firebaseService: FirebaseService) {}

  private getCurrentUserId(): string {
    return firebaseAuthService.getCurrentUserId();
  }

  // -------- User Profile methods --------

  async createUserProfile(
    profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">
  ): Promise<UserProfile> {
    const now = new Date();
    const profileData = {
      ...profile,
      createdAt: now,
      updatedAt: now,
    };

    const doc = await this.firebaseService.addUserDocument(
      FirestoreCollections.USER_PROFILES,
      profileData
    );

    return {
      id: doc.id,
      ...profileData,
    };
  }

  async getUserProfile(userId?: string): Promise<UserProfile | null> {
    const id = userId || this.getCurrentUserId();
    const profiles =
      await this.firebaseService.getUserCollection<UserProfileApi>(
        FirestoreCollections.USER_PROFILES
      );

    // Find the profile for this user
    const profileData = profiles.find((p) => p.id === id);
    return profileData ? UserProfileMapper.map(profileData) : null;
  }

  async updateUserProfile(
    id: string,
    data: Partial<Omit<UserProfile, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    await this.firebaseService.updateUserDocument(
      FirestoreCollections.USER_PROFILES,
      id,
      {
        ...data,
        updatedAt: new Date(),
      }
    );
  }

  subscribeToUserProfile(
    callback: (profile: UserProfile | null) => void,
    options?: SubscriptionOptions
  ): () => void {
    const { onError, setLoading } = options || {};

    if (setLoading) setLoading(true);

    return this.firebaseService.subscribeToUserCollection<UserProfileApi>(
      FirestoreCollections.USER_PROFILES,
      (data) => {
        if (setLoading) setLoading(false);

        const userId = this.getCurrentUserId();
        const profileData = data.find((p) => p.id === userId);
        callback(profileData ? UserProfileMapper.map(profileData) : null);
      },
      (error) => {
        if (setLoading) setLoading(false);
        if (onError) onError(error);
      }
    );
  }

  // -------- User Settings methods --------

  async getUserSettings(): Promise<UserSettings | null> {
    const userId = this.getCurrentUserId();
    const settings =
      await this.firebaseService.getUserCollection<UserSettingsApi>(
        FirestoreCollections.USER_SETTINGS
      );

    // Find settings for this user
    const settingsData = settings.find((s) => s.userId === userId);
    return settingsData ? UserSettingsMapper.map(settingsData) : null;
  }

  async createOrUpdateUserSettings(
    settings: Partial<
      Omit<UserSettings, "id" | "userId" | "createdAt" | "updatedAt">
    >
  ): Promise<UserSettings> {
    const userId = this.getCurrentUserId();
    const existingSettings = await this.getUserSettings();
    const now = new Date();

    if (existingSettings) {
      // Update existing settings
      await this.firebaseService.updateUserDocument(
        FirestoreCollections.USER_SETTINGS,
        existingSettings.id,
        {
          ...settings,
          updatedAt: now,
        }
      );

      return {
        ...existingSettings,
        ...settings,
        updatedAt: now,
      };
    } else {
      // Create new settings
      const defaultSettings: Omit<UserSettings, "id"> = {
        userId,
        theme: "light",
        notificationsEnabled: true,
        createdAt: now,
        updatedAt: now,
        ...settings,
      };

      const doc = await this.firebaseService.addUserDocument(
        FirestoreCollections.USER_SETTINGS,
        defaultSettings
      );

      return {
        id: doc.id,
        ...defaultSettings,
      };
    }
  }

  subscribeToUserSettings(
    callback: (settings: UserSettings | null) => void,
    options?: SubscriptionOptions
  ): () => void {
    const { onError, setLoading } = options || {};

    if (setLoading) setLoading(true);

    return this.firebaseService.subscribeToUserCollection<UserSettingsApi>(
      FirestoreCollections.USER_SETTINGS,
      (data) => {
        if (setLoading) setLoading(false);

        const userId = this.getCurrentUserId();
        const settingsData = data.find((s) => s.userId === userId);
        callback(settingsData ? UserSettingsMapper.map(settingsData) : null);
      },
      (error) => {
        if (setLoading) setLoading(false);
        if (onError) onError(error);
      }
    );
  }
}
