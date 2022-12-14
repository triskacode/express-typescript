import { Cache } from "cache-manager";
import { NextFunction, Request, Response } from "express";

export const httpRequestCachingMiddleware =
  (cacheService: Cache) =>
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.method.toLocaleUpperCase() !== "GET") {
      return next();
    }

    const cacheKey = req.url;
    const cache = await cacheService.get(cacheKey);

    if (cache) {
      return res.send(cache);
    } else {
      const _oldWrite = res.write;
      const _oldEnd = res.end;

      const chunks = [] as Buffer[];

      res.write = function (chunk) {
        chunks.push(chunk);

        return _oldWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk) chunks.push(chunk);

        const body = Buffer.concat(chunks).toString("utf8");

        cacheService.set(cacheKey, body, { ttl: 5 });

        return _oldEnd.apply(res, arguments);
      };

      return next();
    }
  };
