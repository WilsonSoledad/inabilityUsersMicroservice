export class DuplicateError extends Error {
  public readonly statusCode = 409;
  public readonly field: string | undefined;

  constructor(message: string, field?: string) {
    super(message);
    this.name = "DuplicateError";
    this.field = field;
    Object.setPrototypeOf(this, DuplicateError.prototype);
  }
}
