import { NextFunction, Request, Response } from "express";

export function wrapController<Fn extends Function>(fn: Fn) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const statusCode = req.method === "POST" ? 201 : 200;
      const returnFn = fn(req, res);

      res.status(statusCode).send(returnFn);
    } catch (error) {
      next(error);
    }
  };
}
