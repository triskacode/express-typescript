import { Cache } from "cache-manager";
import { Controller } from "common/types";
import cors from "cors";
import { default as express, Application } from "express";
import compression from "compression";
import { AppRouter } from "./app.router";
import { httpExceptionHandler } from "./exception-handler/http.exception-handler";
import { httpRequestLoggerMiddleware } from "./middleware/http-request-logger.middleware";
import { requestTimeoutMiddleware } from "./middleware/request-timeout.middleware";
import { httpRequestCachingMiddleware } from "./middleware/http-request-caching.middleware";

export class AppService {
  private app: Application;

  constructor(private readonly cacheService: Cache) {
    this.app = express();

    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(compression());

    this.loadDefaultMiddlewares();
    this.app.get("/health-check", (_, res) => res.send("OK"));
    this.loadDefaultErrorHandler();
  }

  loadController(controller: Controller) {
    controller.initializeRoute(AppRouter);

    this.app.use(AppRouter.router);
    this.loadDefaultErrorHandler();

    return this;
  }

  listen(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }

  private loadDefaultMiddlewares() {
    this.app.use(httpRequestLoggerMiddleware);
    // not working in clustering app must use external cache like redis
    // this.app.use(httpRequestCachingMiddleware(this.cacheService));
    this.app.use(requestTimeoutMiddleware);
  }

  private loadDefaultErrorHandler() {
    this.app.use(httpExceptionHandler);
  }
}
