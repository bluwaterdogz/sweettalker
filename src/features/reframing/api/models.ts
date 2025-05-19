import { ReframingModalityIdentifier, ReframingModalityLabel } from "../enums";
import { Interpretation } from "@/features/common/api/models";

export interface Reframing extends Interpretation {
  modality: ReframingModality;
  userMessageId: string;
  notes?: string;
}

export interface ReframingApi {
  modality: ReframingModalityIdentifier;
  text: string;
  description: string;
}

export interface ReframingModality {
  id: ReframingModalityIdentifier;
  label: ReframingModalityLabel;
  description: string;
}
