import { baseModelMapper } from "@/services/base/mappers";
import { Interpretation, UserMessage, UserMessageApi } from "./models";

export const interpretationMapper = (data: Interpretation): Interpretation => {
  return {
    ...baseModelMapper(data),
    text: data.text,
    description: data.description,
    userMessageId: data.userMessageId,
    title: data.title,
    rating: data.rating,
    favorite: data.favorite,
    model: data.model,
    notes: data.notes || "",
  };
};

export class UserMessageMapper {
  static map(data: UserMessageApi): UserMessage {
    return {
      ...baseModelMapper(data),
      text: data.text,
    };
  }
}
