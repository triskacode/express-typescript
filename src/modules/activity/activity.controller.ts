import { IController } from "common/interfaces";
import { Request, Response, Router } from "express";
import { ActivityRepository } from "./activity.repository";
import { CreateActivityDto } from "./dto/create-activity.dto";

export class ActivityController implements IController {
  private readonly baseRoutePath = "/activity";

  constructor(private readonly activityRepository: ActivityRepository) {}

  initializeRoute(router: Router): Router {
    router.get(this.baseRoutePath, this.getActivities.bind(this));
    router.post(this.baseRoutePath, this.createActivity.bind(this));

    return router;
  }

  private async getActivities(req: Request, res: Response) {
    const activities = await this.activityRepository.getActivities();

    res.send(activities);
  }
  private async createActivity(req: Request, res: Response) {
    const dto: CreateActivityDto = {
      email: req.body.email,
      title: req.body.title,
    };

    const activity = await this.activityRepository.create(dto);

    res.status(201).send(activity);
  }
}
