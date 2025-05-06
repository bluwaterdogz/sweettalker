export class AuthError extends Error {
  code: string;

  constructor({ code, message }: { code: string; message: string }) {
    super(message);
    this.code = code;
    this.name = "AuthError";
  }
}

export class DataError extends Error {
  code: string;

  constructor({ code, message }: { code: string; message: string }) {
    super(message);
    this.code = code;
    this.name = "DataError";
  }
}
