import { chatGPTApi } from "@/services/axios";
import { safeJsonParseGPT } from "@/services/chatGPT/safeJsonParseGPT";
import { Model } from "./enums";
import { Moderation } from "./models";

export interface InterpretationParams {
  model: Model;
  input: string;
}

export interface ModerationParams {
  input: string;
}

export class InterpretationClient<T> {
  async interpretText(params: InterpretationParams): Promise<T[]> {
    const { model, input } = params;
    const response = await chatGPTApi.post("/responses", {
      model,
      input,
    });

    const parsed = this.parseResponse(response);
    if (!parsed) {
      throw new Error("Failed to parse reframing response");
    }
    return parsed;
  }

  async moderateText({ input }: ModerationParams): Promise<Moderation> {
    const response = await chatGPTApi.post("/moderations", {
      input,
      model: "text-moderation-stable",
    });
    return response.data.results[0];
  }

  parseResponse(response: any): T[] | null {
    const content = response.data.output[0].content[0].text;
    const parsed = safeJsonParseGPT<T>(content);
    return parsed;
  }
}
