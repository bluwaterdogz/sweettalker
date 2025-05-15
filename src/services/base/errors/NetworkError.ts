export class NetworkError extends Error {
  type = "NetworkError";
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}
