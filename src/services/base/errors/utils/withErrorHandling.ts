import { ValidationError } from "../model/ValidationError";
import { retry } from "./retry";

interface ErrorHandlingOptions {
  maxRetries?: number;
  shouldRetry?: (error: unknown) => boolean;
  errorMessage?: string | ((ctx: any, method: string | symbol) => string);
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
      const methodName = String(propertyKey);
      const context = this;

      const logError = (error: unknown) => {
        const dynamicMessage =
          typeof options.errorMessage === "function"
            ? options.errorMessage(context, methodName)
            : options.errorMessage || `Error in ${methodName}:`;

        console.error(dynamicMessage, error);
      };

      try {
        const result = originalMethod.apply(context, args);

        if (result instanceof Promise) {
          return result.catch((error) => {
            logError(error);
            return retry(() => originalMethod.apply(context, args), error, {
              maxRetries: options.maxRetries,
              shouldRetry:
                options.shouldRetry ||
                ((err) => !(err instanceof ValidationError)),
            });
          });
        }

        return result;
      } catch (error) {
        logError(error);
        return retry(() => originalMethod.apply(context, args), error, {
          maxRetries: options.maxRetries,
          shouldRetry:
            options.shouldRetry || ((err) => !(err instanceof ValidationError)),
        });
      }
    };

    return descriptor;
  };
}
