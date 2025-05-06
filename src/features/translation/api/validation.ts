import type { TranslationService } from "./service";
import { unsafePatterns } from "./consts";
import { Moderation } from "./models";

interface SafetyCheckResult {
  isSafe: boolean;
  reasons: string[];
}

function checkUnsafeContent(text: string): SafetyCheckResult {
  const reasons: string[] = [];

  for (const { pattern, reason } of unsafePatterns) {
    if (pattern.test(text)) {
      reasons.push(reason);
    }
  }

  return {
    isSafe: reasons.length === 0,
    reasons,
  };
}

export async function validateUserMessage(
  userMessage: string,
  translationService: TranslationService
): Promise<Moderation> {
  // Step 1: Local safety check
  const localCheck = checkUnsafeContent(userMessage);
  if (!localCheck.isSafe) {
    return {
      isFlagged: true,
      categories: localCheck.reasons.reduce(
        (acc, reason) => ({ ...acc, [reason]: true }),
        {}
      ),
    };
  }

  // Step 2: OpenAI Moderation API check
  const modResult = await translationService.moderateText({
    input: userMessage,
  });

  return modResult;
}
