import { translationModalities } from "./consts";
import { RelationalContext } from "./enums";
import { generatePromptGPT3_5 } from "./prompts";
import { generatePromptGPT4 } from "./prompts";
import { Model } from "@/features/common-interpretation/api/enums";

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
  modalities = Object.values(translationModalities).map((m) => m.id),
  context,
  model = Model.Gpt3_5,
}: PromptOptions): string {
  const selected = Object.values(translationModalities).filter((m) =>
    modalities.includes(m.id)
  );
  const identifiers = selected.map((m) => `- ${m.id}`).join("\n");

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
