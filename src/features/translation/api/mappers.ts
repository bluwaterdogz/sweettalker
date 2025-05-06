import {
  Moderation,
  Translation,
  ModerationApi,
  TranslationApi,
  UserMessage,
  UserMessageApi,
} from "./models";

// Mappers
export class ModerationMapper {
  static map(data: ModerationApi): Moderation {
    return {
      isFlagged: data.flagged,
      categories: data.categories,
    };
  }
}

export class TranslationMapper {
  static map(data: any): Translation {
    return {
      id: data.id,
      modality: data.modality,
      model: data.model,
      text: data.text,
      description: data.description,
      createdAt: data.createdAt,
      createdBy: data.createdBy,
      userMessageId: data.userMessageId,
      rating: data.rating || null,
      favorite: data.favorite || null,
    };
  }
}

export class UserMessageMapper {
  static map(data: UserMessageApi): UserMessage {
    return {
      id: data.id,
      text: data.text,
      createdAt: data.createdAt,
    };
  }
}
