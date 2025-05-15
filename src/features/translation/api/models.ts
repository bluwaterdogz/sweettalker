import { Interpretation } from "@/features/common-interpretation/api/models";
import {
  ModalityIdentifier,
  ModalityLabel,
} from "@/features/translation/enums";

// View Models
export interface Edit {
  text: string;
  createdAt: Date;
  id: string;
}

export interface Translation extends Interpretation {
  modality: Modality;
  priorEdits: Edit[];
  notes?: string;
}

export interface Modality {
  id: ModalityIdentifier;
  label: ModalityLabel;
  originator: string;
}

// API Models
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

export interface SubsctiptionOptions {
  onError?: (error: Error) => void;
  setLoading?: (loading: boolean) => void;
}
