import logger from "@repo/logger";
import { AxiosError } from "axios";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import CustomError from "./errors/custom-error";

const errorCatcher = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const { stack, message } = err;

  switch (true) {
    case err instanceof CustomError:
      return res.status(err.status).json({ message });
    case err instanceof ZodError:
      return res.status(400).json({
        errors: err.issues.map((e) => ({
          path: e.path[1],
          message: e.message,
        })),
      });
    case stack && stack.includes("E11000"):
      return res.status(400).json({ message: "Email already taken!" });
    case stack && stack.includes("Unauthenticated"):
      return res.status(401).json({ message: "Unauthenticated!" });
    case err instanceof AxiosError:
      // Handle AxiosError directly
      if (err.response) {
        // The request was made and the server responded with a status code
        return res.status(err.response.status).json(err.response.data);
      } else if (err.request) {
        logger.error(err);
        // The request was made but no response was received
        return res
          .status(500)
          .json({ message: "No response received from the server" });
      }
      // Something happened in setting up the request that triggered an Error
      return res.status(500).json({ message: "Error setting up the request" });

    default:
      logger.error(err);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default errorCatcher;
