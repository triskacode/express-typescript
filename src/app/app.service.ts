import { NotFoundException } from "common/exceptions";
import { Controller } from "common/types";
import cors from "cors";
import {
  default as express,
  Application,
  NextFunction,
  Response,
  Request,
} from "express";
import helmet from "helmet";
import compression from "compression";
import { AppRouter } from "./app.router";
import { httpExceptionHandler } from "./exception-handler/http.exception-handler";
import { httpRequestLoggerMiddleware } from "./middleware/http-request-logger.middleware";
import { requestTimeoutMiddleware } from "./middleware/request-timeout.middleware";

export class AppService {
  private app: Application;

  constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(cors());
    // this.app.use(compression());
    // this.app.use(helmet());

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
    this.app.use(requestTimeoutMiddleware);
    this.app.use(httpRequestLoggerMiddleware);
  }

  private loadDefaultErrorHandler() {
    this.app.use(httpExceptionHandler);
  }
}
