import { IController } from "common/interfaces";
import cors from "cors";
import { default as express, Application } from "express";
import helmet from "helmet";

export class AppService {
  private app: Application;

  constructor() {
    this.app = express();

    this.loadDefaultMiddlewares();

    this.app.get("/health-check", (_, res) => res.send("OK"));
  }

  loadController(controller: IController) {
    const router = controller.initializeRoute(express.Router());

    this.app.use(router);

    return this;
  }

  listen(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }

  private loadDefaultMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(helmet());
  }
}
