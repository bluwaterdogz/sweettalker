import { MODALITIES } from "./consts";
import { Model, RelationalContext } from "./enums";
import { generatePromptGPT3_5 } from "./prompts";
import { generatePromptGPT4 } from "./prompts";

// todo, check this package
// import { encoding_for_model } from "@dqbd/tiktoken";

// export function estimateTokens(
//   text: string,
//   model: "gpt-3.5-turbo" | "gpt-4" = "gpt-3.5-turbo"
// ): number {
//   const enc = encoding_for_model(model);
//   const tokens = enc.encode(text);
//   return tokens.length;
// }

export function estimateTokensRough(text: string): number {
  return Math.ceil(text.length / 4); // very rough approximation
}

/**
 * Attempts to extract and parse a JSON array from a GPT response.
 * Works even if the model returns explanations, labels, or markdown.
 */

export function safeJsonParseGPT(responseText: string): any[] | null {
  try {
    // Step 1: Try direct JSON parse first
    const direct = JSON.parse(responseText);
    if (Array.isArray(direct)) return direct;
  } catch {}

  // Step 2: Extract content between first "[" and last "]"
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

type PromptOptions = {
  userMessage: string;
  modalities?: string[];
  context?: RelationalContext;
  model: Model;
};

export const generatePromptFunctionMap: Record<
  Model,
  (...args: any[]) => string
> = {
  [Model.Gpt4]: generatePromptGPT4,
  [Model.Gpt3_5]: generatePromptGPT3_5,
};

export function generateRelationalPrompt({
  userMessage,
  modalities = MODALITIES.map((m) => m.id),
  context,
  model = Model.Gpt3_5,
}: PromptOptions): string {
  const selected = MODALITIES.filter((m) => modalities.includes(m.id));
  const identifiers = selected.map((m) => `- ${m.identifier}`).join("\n");

  const contextLine = context
    ? `This is in the context of a ${context} relationship.`
    : "";

  const prompt = generatePromptFunctionMap[model](
    identifiers,
    contextLine,
    userMessage
  ).trim();

  return prompt;
}
