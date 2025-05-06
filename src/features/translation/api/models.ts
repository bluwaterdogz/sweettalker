import {
  ModalityIdentifier,
  ModalityLabel,
} from "@/features/translation/enums";

// View Models
export interface Moderation {
  isFlagged: boolean;
  categories: Record<string, boolean>;
}

export interface Translation {
  id: string;
  modality: ModalityIdentifier;
  model: string;
  text: string;
  description: string;
  userMessageId: string;
  createdAt: Date | null;
  createdBy: string | null;
  rating: number | null;
  favorite: boolean | null;
}

export interface Modality {
  id: string;
  label: ModalityLabel;
  originator: string;
  identifier: ModalityIdentifier;
}

// I am adding a new interface for persisting user messages with metadata.
export interface UserMessage {
  id: string;
  text: string;
  createdAt: Date;
}

// API Models
export interface ModerationApi {
  flagged: boolean;
  categories: Record<string, boolean>;
}

export interface TranslationApi {
  modality: ModalityIdentifier;
  text: string;
  description: string;
}

// Interface for storing version snapshots of translations
export interface TranslationVersion {
  id: string; // Firestore document id for the version
  translationId: string; // The id of the translation this version belongs to
  data: Partial<Translation>; // Snapshot of changed translation fields
  versionedAt: Date;
}

export interface UserMessageApi {
  id: string;
  text: string;
  createdAt: Date;
}

export interface SubsctiptionOptions {
  onError?: (error: Error) => void;
  setLoading?: (loading: boolean) => void;
}
