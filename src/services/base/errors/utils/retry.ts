import { sleep } from "@/common/utils";
import { ValidationError } from "..";

const MAX_RETRIES = 1;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  shouldRetry?: (error: unknown) => boolean;
}

export async function retry<T>(
  operation: () => Promise<T>,
  error: unknown,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = MAX_RETRIES,
    retryDelay = INITIAL_RETRY_DELAY,
    shouldRetry = () => !(error instanceof ValidationError),
  } = options;

  let lastError = error;
  let attempt = 1; // Start at 1 since we already failed once

  while (attempt <= maxRetries) {
    if (!shouldRetry(lastError)) {
      throw lastError;
    }

    try {
      // Exponential backoff with jitter
      const delay =
        retryDelay * Math.pow(2, attempt - 1) * (0.5 + Math.random());
      await sleep(delay);

      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;
    }
  }

  throw lastError;
}
