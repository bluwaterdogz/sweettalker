export class ApplicationError extends Error {
  type = "ApplicationError";
  constructor(message: string) {
    super(message);
    this.name = "ApplicationError";
  }
}
