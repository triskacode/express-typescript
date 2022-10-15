import { IController } from "common/interfaces";
import { Request, Response, Router } from "express";

export class ActivityController implements IController {
  router: Router;
  private baseRoutePath = "/activity";

  constructor() {
    this.router = Router();
    this.initializeRouter();
  }

  private initializeRouter() {
    this.router.get(this.baseRoutePath, this.getActivities.bind(this));
  }

  private getActivities(req: Request, res: Response) {
    res.send(`value of baseRouterPath is: ${this.baseRoutePath}`);
  }
}
