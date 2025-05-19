export const serializeError = (error: unknown) => {
  return {
    message:
      error instanceof Error ? error.message : "An unknown error occurred",
    name: error instanceof Error ? error.name : "UnknownError",
    stack: error instanceof Error ? error.stack : undefined,
  };
};
