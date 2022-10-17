import {
  RequestTimeoutException,
  ServiceUnavailableException,
} from "common/exceptions";
import { NextFunction, Request, Response } from "express";

export function requestTimeoutMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.setTimeout(5 * 1000, () => {
    let error = new RequestTimeoutException("Request Timeout");
    return next(error);
  });

  res.setTimeout(5 * 1000, () => {
    let error = new ServiceUnavailableException("Service Unavailable");
    return next(error);
  });

   return next();
}
