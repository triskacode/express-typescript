import { Cache } from "cache-manager";
import { NextFunction, Request, Response } from "express";

export const httpRequestCachingMiddleware =
  (cacheService: Cache) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method.toLocaleUpperCase() === "GET") {
      const cacheKey = req.path;
      const cache = await cacheService.get(cacheKey);
      console.log(cache);
      //   if(cacheKey)
      const _oldWrite = res.write;
      const _oldEnd = res.end;

      const chunks = [] as Buffer[];
      let body: any;

      res.write = function (chunk) {
        chunks.push(chunk);

        return _oldWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk) chunks.push(chunk);

        body = Buffer.concat(chunks).toString("utf8");

        //   cacheService.set(cacheKey, body);
        //   console.log(body);
        return _oldEnd.apply(res, arguments);
      };
    }

    return next();
  };
