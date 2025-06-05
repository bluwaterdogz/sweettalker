import { toxicPhrases } from "../consts/toxicPhrases";

// Normalize input (lowercase, trim punctuation)
const normalize = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();

export function detectToxicPhrases(message: string): string[] {
  const normalized = normalize(message);

  return toxicPhrases.filter((phrase) => {
    const normPhrase = normalize(phrase);
    return normalized.includes(normPhrase);
  });
}
