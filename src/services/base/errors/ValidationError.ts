export class ValidationError extends Error {
  type = "ValidationError";
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
