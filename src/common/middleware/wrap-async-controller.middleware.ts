import { NextFunction, Request, Response } from "express";

export function wrapAsyncController<Fn extends Function>(fn: Fn) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusCode = req.method === "POST" ? 201 : 200;
      const returnFn = await fn(req, res);

      res.status(statusCode).send(returnFn);
    } catch (error) {
      next(error);
    }
  };
}
