import CustomError from "@/middlewares/errors/custom-error";

export default class NotFoundError extends CustomError {
  // Override the status code for NotFoundError
  status = 404;

  constructor(message: string = "Not Found") {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return { msg: this.message, status: this.status };
  }
}
