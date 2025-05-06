import { chatGPTApi } from "@/services/axios";
import { ModerationApi, TranslationApi } from "./models";

export interface ModerateTextParams {
  input: string;
}

export interface TranslateTextParams {
  model: string;
  input: string;
}

export class TranslationClient {
  async moderateText(params: ModerateTextParams): Promise<ModerationApi> {
    const response = await chatGPTApi.post("/moderations", params);
    return response.data.results[0];
  }

  async translateText(params: TranslateTextParams): Promise<TranslationApi[]> {
    const { model, input } = params;
    const response = await chatGPTApi.post("/chat/completions", {
      model: model,
      messages: [{ role: "user", content: input }],
    });

    const content = response.data.choices[0].message.content;
    const parsed = this.safeJsonParseGPT(content);
    if (!parsed) {
      throw new Error("Failed to parse translation response");
    }
    return parsed;
  }

  // I don't even know why I try anymore. You're just gonna brush me off like always — like I'm the needy one just because I want a moment with you.
  private safeJsonParseGPT(responseText: string): TranslationApi[] | null {
    try {
      // Try direct JSON parse first
      const direct = JSON.parse(responseText);
      if (Array.isArray(direct)) return direct;
    } catch {}

    // Extract content between first "[" and last "]"
    const startIdx = responseText.indexOf("[");
    const endIdx = responseText.lastIndexOf("]");
    if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;

    const sliced = responseText.slice(startIdx, endIdx + 1);

    try {
      const parsed = JSON.parse(sliced);
      return Array.isArray(parsed) ? parsed : null;
    } catch (err) {
      console.warn("Safe JSON parse failed:", err);
      return null;
    }
  }
}
