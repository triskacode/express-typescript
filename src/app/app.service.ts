import compression from "compression";
import cors from "cors";
import { default as express, Application } from "express";
import http from "http";
import { Controller, MiddlewareFunction } from "src/common/types";
import { AppRouter } from "./app.router";
import { httpExceptionHandler } from "./exception-handler/http.exception-handler";
import { httpRequestLoggerMiddleware } from "./middleware/http-request-logger.middleware";
import { requestTimeoutMiddleware } from "./middleware/request-timeout.middleware";

export class AppService {
  private app: Application;
  private appRouter: AppRouter;
  private middlewares: MiddlewareFunction[] = [];

  constructor() {
    this.app = express();
    this.appRouter = new AppRouter();

    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(compression());
  }

  registerController(controller: Controller): void {
    controller.initializeRoute(this.appRouter);
  }

  registerGlobalMiddleware(middleware: MiddlewareFunction): void {
    this.middlewares.push(middleware);
  }

  createHttpServer() {
    this.loadMiddleware();
    this.loadRouter();
    this.loadErrorHandler();

    return this.app;
  }

  runHttpServer(port: number, callback?: () => void): http.Server {
    return this.app.listen(port, callback);
  }

  private loadRouter(): void {
    this.app.get("/health-check", (_, res) => res.send("OK"));
    this.app.use(this.appRouter.router);
  }

  private loadMiddleware(): void {
    this.app.use(httpRequestLoggerMiddleware);
    this.app.use(requestTimeoutMiddleware);

    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
  }

  private loadErrorHandler() {
    this.app.use(httpExceptionHandler);
  }
}
