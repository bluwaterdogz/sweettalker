import { Modality } from "./api/models";
import { translationModalities } from "./consts";
import { RelationalContext } from "./enums";
import { generatePromptGPT3_5 } from "./prompts";
import { generatePromptGPT4 } from "./prompts";
import { Model } from "@/features/common/api/enums";

export function estimateTokensRough(text: string): number {
  return Math.ceil(text.length / 4); // very rough approximation
}

interface PromptArgs {
  input: string;
  model: Model;
  options: PromptOptions;
}

export interface PromptOptions {
  modalities?: Modality[];
  context?: RelationalContext;
  tone?: string;
}

export const generatePromptFunctionMap: Record<
  Model,
  (...args: any[]) => string
> = {
  [Model.Gpt4]: generatePromptGPT4,
  [Model.Gpt3_5]: generatePromptGPT3_5,
};

export function generateRelationalPrompt({
  input,
  options,
  model = Model.Gpt3_5,
}: PromptArgs): string {
  const {
    modalities = Object.values(translationModalities),
    context,
    tone = "gentle",
  } = options;

  const contextLine = context
    ? `This is in the context of a ${context} relationship.`
    : "";

  const prompt = generatePromptFunctionMap[model](
    modalities,
    contextLine,
    input,
    tone
  ).trim();

  return prompt;
}
