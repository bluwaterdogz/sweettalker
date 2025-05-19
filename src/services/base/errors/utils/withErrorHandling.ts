import { ValidationError } from "../model/ValidationError";
import { retry } from "./retry";

interface ErrorHandlingOptions {
  maxRetries?: number;
  shouldRetry?: (error: unknown) => boolean;
  errorMessage?: string;
}

type MethodDecorator = (
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => PropertyDescriptor | void;

export function withErrorHandling(
  options: ErrorHandlingOptions = {}
): MethodDecorator {
  return function (
    _target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      try {
        const result = originalMethod.apply(this, args);

        // Handle async functions
        if (result instanceof Promise) {
          return result.catch((error) => {
            console.error(
              options.errorMessage || `Error in ${String(propertyKey)}:`,
              error
            );
            return retry(() => originalMethod.apply(this, args), error, {
              maxRetries: options.maxRetries,
              shouldRetry:
                options.shouldRetry ||
                ((err) => !(err instanceof ValidationError)),
            });
          });
        }

        // Handle sync functions
        return result;
      } catch (error) {
        console.error(
          options.errorMessage || `Error in ${String(propertyKey)}:`,
          error
        );
        return retry(() => originalMethod.apply(this, args), error, {
          maxRetries: options.maxRetries,
          shouldRetry:
            options.shouldRetry || ((err) => !(err instanceof ValidationError)),
        });
      }
    };

    return descriptor;
  };
}
