import { interpretationServiceApi } from "@/services/axios";
import { Moderation } from "@common/models/moderation/moderation";
import { InterpretationParams } from "@common/models/interpretation/interpretation-params";
import { ModerationParams } from "@common/models/moderation/moderation-params";
import { MessageOptimalResult } from "@common/models/chat/message-optimal-result";
import { ConversationSentiment } from "@common/models/chat/conversation-sentiment";
import { ResponseSuggestion } from "@common/models/chat/response-suggestion";
import { ResponseSuggestionsPromptOptions } from "@common/query/response-suggestion-prompt-options";

export class InterpretationClient<T, O = any> {
  async interpretText(params: InterpretationParams<O>): Promise<T[]> {
    const response = await interpretationServiceApi.post(
      "/interpretation/interpret",
      params
    );
    return response.data;
  }

  async moderateText({ input }: ModerationParams): Promise<Moderation> {
    const response = await interpretationServiceApi.post(
      "/moderation/moderate",
      {
        input,
        model: "text-moderation-stable",
      }
    );

    return response.data;
  }

  async getConversationSentiment(
    messages: string[]
  ): Promise<ConversationSentiment> {
    const response = await interpretationServiceApi.post<ConversationSentiment>(
      "/interpretation/conversation-sentiment",
      {
        messages,
      }
    );
    return response.data;
  }

  async getResponseSuggestions(
    options: ResponseSuggestionsPromptOptions
  ): Promise<ResponseSuggestion[]> {
    const response = await interpretationServiceApi.post<ResponseSuggestion[]>(
      "/interpretation/response-suggestions",
      options
    );
    return response.data;
  }

  async isMessageOptimal(message: string): Promise<MessageOptimalResult> {
    const response = await interpretationServiceApi.post<MessageOptimalResult>(
      "/interpretation/is-message-optimal",
      {
        message,
      }
    );
    return response.data;
  }
}
