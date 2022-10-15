import { NotFoundException } from "common/exceptions/not-found.exception";
import { IController } from "common/interfaces";
import { wrapAsyncController } from "common/middleware/wrap-async-controller.middleware";
import { Request, Response, Router } from "express";
import { ActivityRepository } from "./activity.repository";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityAttributes } from "./entities/types/activity.type";

export class ActivityController implements IController {
  private readonly baseRoutePath = "/activity";

  constructor(private readonly activityRepository: ActivityRepository) {}

  initializeRoute(router: Router): Router {
    router.get(
      this.baseRoutePath,
      wrapAsyncController(this.getActivities.bind(this))
    );
    router.post(
      this.baseRoutePath,
      wrapAsyncController(this.createActivity.bind(this))
    );
    router.get(
      this.baseRoutePath + "/:id",
      wrapAsyncController(this.getActivity.bind(this))
    );
    router.patch(
      this.baseRoutePath + "/:id",
      wrapAsyncController(this.updateActivity.bind(this))
    );
    router.delete(
      this.baseRoutePath + "/:id",
      wrapAsyncController(this.deleteActivity.bind(this))
    );

    return router;
  }

  private async getActivities(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes[]> {
    const activities = await this.activityRepository.getActivities();

    return activities;
  }

  private async getActivity(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes> {
    const id = req.params.id;

    const activity = await this.activityRepository.getActivity(+id);

    if (!activity)
      throw new NotFoundException(`Activity with id: ${id} not found`);

    return activity;
  }

  private async createActivity(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes> {
    const dto: CreateActivityDto = {
      email: req.body.email,
      title: req.body.title,
    };

    const activity = await this.activityRepository.create(dto);

    return activity;
  }

  private async updateActivity(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes> {
    const id = req.params.id;

    const activity = await this.activityRepository.getActivity(+id);

    if (!activity)
      throw new NotFoundException(`Activity with id: ${id} not found`);

    const dto: UpdateActivityDto = {
      ...(req.body.email ? { email: req.body.email } : {}),
      ...(req.body.title ? { title: req.body.title } : {}),
    };

    const updatedActivity = await this.activityRepository.updateActivity(
      activity,
      dto
    );

    return updatedActivity;
  }

  private async deleteActivity(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes> {
    const id = req.params.id;

    const activity = await this.activityRepository.getActivity(+id);

    if (!activity)
      throw new NotFoundException(`Activity with id: ${id} not found`);

    const deletedActivity = await this.activityRepository.deleteActivity(
      activity
    );

    return deletedActivity;
  }
}
