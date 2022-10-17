import {
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from "common/exceptions";
import { logger } from "common/utils";
import { NextFunction, Request, Response } from "express";

export function httpExceptionHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  switch (err.constructor) {
    case NotFoundException:
      return res.status(404).send(err.message);
    case RequestTimeoutException:
      return res.status(408).send(err.message);
    case ServiceUnavailableException:
      return res.status(503).send(err.message);
    default:
      logger.error(err.message, err.stack);
      return res.status(500).send("Internal Server Error");
  }
}
