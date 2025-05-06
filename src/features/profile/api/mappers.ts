import {
  UserProfile,
  UserProfileApi,
  UserSettings,
  UserSettingsApi,
} from "./models";

export class UserProfileMapper {
  static map(data: UserProfileApi): UserProfile {
    // Convert Firestore Timestamps to JS Dates if necessary
    const createdAt = data.createdAt?.toDate
      ? data.createdAt.toDate()
      : data.createdAt;
    const updatedAt = data.updatedAt?.toDate
      ? data.updatedAt.toDate()
      : data.updatedAt;

    return {
      id: data.id,
      displayName: data.displayName,
      bio: data.bio,
      photoUrl: data.photoUrl,
      location: data.location,
      website: data.website,
      createdAt,
      updatedAt,
    };
  }
}

export class UserSettingsMapper {
  static map(data: UserSettingsApi): UserSettings {
    // Convert Firestore Timestamps to JS Dates if necessary
    const createdAt = data.createdAt?.toDate
      ? data.createdAt.toDate()
      : data.createdAt;
    const updatedAt = data.updatedAt?.toDate
      ? data.updatedAt.toDate()
      : data.updatedAt;

    return {
      id: data.id,
      userId: data.userId,
      theme: data.theme,
      notificationsEnabled: data.notificationsEnabled,
      autoTranslate: data.autoTranslate,
      defaultLanguage: data.defaultLanguage,
      createdAt,
      updatedAt,
    };
  }
}
