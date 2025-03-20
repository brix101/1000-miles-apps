export default class CustomError extends Error {
  // Override the status code for NotFoundError
  status = 500;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
