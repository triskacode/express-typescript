import { NextFunction, Request, Response } from "express";
import {
  BadRequestException,
  NotFoundException,
  RequestTimeoutException,
  ServiceUnavailableException,
} from "src/common/exceptions";
import { logger } from "src/common/utils";

export function httpExceptionHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = 500 as number;
  let respBody = {} as { status: string; message: string };

  switch (err.constructor) {
    case BadRequestException:
      statusCode = 400;
      respBody.status = "Bad Request";
      respBody.message = err.message;
      break;
    case NotFoundException:
      statusCode = 404;
      respBody.status = "Not Found";
      respBody.message = err.message;
      break;
    case RequestTimeoutException:
      statusCode = 408;
      respBody.status = "Request Timeout";
      respBody.message = err.message;
      break;
    case ServiceUnavailableException:
      statusCode = 503;
      respBody.status = "Service Unavailable";
      respBody.message = err.message;
      break;
    default:
      logger.error(err.message, err.stack);
      statusCode = 500;
      respBody.status = "Internal Server Error";
      respBody.message = "Internal Server Error";
      break;
  }

  return res.status(statusCode).send(respBody);
}
