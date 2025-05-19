import { BaseModel } from "@/services/base/model";
import { Model } from "./enums";

export interface Interpretation extends BaseModel {
  text: string;
  description: string;
  userMessageId: string;
  title?: string;
  rating?: number;
  favorite?: boolean;
  model: Model;
  notes?: string;
}

export interface UserMessage extends BaseModel {
  text: string;
}

export interface Moderation {
  flagged: boolean;
  categories: {
    [key: string]: boolean;
  };
}

export interface UserMessageApi {
  text: string;
}
