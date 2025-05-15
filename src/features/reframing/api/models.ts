import { ReframingModalityIdentifier } from "../enums";
import { Interpretation } from "@/features/common-interpretation/api/models";

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
  label: string;
  description: string;
}
