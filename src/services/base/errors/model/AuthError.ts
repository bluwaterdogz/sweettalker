export class AuthError extends Error {
  type = "AuthError";
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
