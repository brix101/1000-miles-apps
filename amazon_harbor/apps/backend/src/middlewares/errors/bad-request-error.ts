import CustomError from "@/middlewares/errors/custom-error";

export default class BadRequestError extends CustomError {
  // Override the status code for NotFoundError
  status = 400;

  constructor(message: string = "Bad Request") {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return { msg: this.message, status: this.status };
  }
}
