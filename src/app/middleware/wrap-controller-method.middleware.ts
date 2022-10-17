import { ControllerMethod, MiddlewareFunction } from "common/types";
import { NextFunction, Request, Response } from "express";

export const wrapControllerMethodMiddleware = <Fn extends ControllerMethod>(
  fn: Fn
): MiddlewareFunction => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusCode = req.method === "POST" ? 201 : 200;
      const returnFn = await fn(req, res);
      const respBody = {
        status: "Success",
        data: returnFn,
      };

      return !res.writableEnded && res.status(statusCode).send(respBody);
    } catch (error) {
      return next(error);
    }
  };
};