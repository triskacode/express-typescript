import { NotFoundException } from "common/exceptions/not-found.exception";
import { IController } from "common/interfaces";
import cors from "cors";
import {
  default as express,
  Application,
  NextFunction,
  Response,
  Request,
} from "express";
import helmet from "helmet";

export class AppService {
  private app: Application;

  constructor() {
    this.app = express();

    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());

    this.app.get("/health-check", (_, res) => res.send("OK"));
    this.loadDefaultMiddlewares();
    this.loadDefaultErrorHandler();
  }

  loadController(controller: IController) {
    const router = controller.initializeRoute(express.Router());

    this.app.use(router);
    this.loadDefaultMiddlewares();
    this.loadDefaultErrorHandler();

    return this;
  }

  listen(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }

  private loadDefaultMiddlewares() {}

  private loadDefaultErrorHandler() {
    this.app.use(
      (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(err);

        switch (err.constructor) {
          case NotFoundException:
            res.status(404).send(err.message);
            break;
          default:
            res.status(500).send("Internal Server Error");
            break;
        }
      }
    );
  }
}
