import { AppRouter } from "src/app";
import { Controller } from "src/common/types";
import { Request, Response } from "express";
import { ActivityService } from "./activity.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityAttributes } from "./entities/types/activity.type";

export class ActivityController implements Controller {
  private readonly baseRoutePath = "/activity-groups";

  constructor(private readonly activityService: ActivityService) {}

  initializeRoute(router: AppRouter): void {
    router.get(this.baseRoutePath, this.getActivities.bind(this));
    router.post(this.baseRoutePath, this.createActivity.bind(this));
    router.get(this.baseRoutePath + "/:id", this.getActivity.bind(this));
    router.patch(this.baseRoutePath + "/:id", this.updateActivity.bind(this));
    router.delete(this.baseRoutePath + "/:id", this.deleteActivity.bind(this));
  }

  async getActivities(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes[]> {
    const email = req.query.email as string;
    const filter: FilterGetActivitiesDto = {
      take: 10,
      ...(email !== undefined ? { where: { email } } : {}),
    };

    return this.activityService.getActivities(filter);
  }

  async getActivity(req: Request, res: Response): Promise<ActivityAttributes> {
    const id = req.params.id;

    return this.activityService.getActivity(+id);
  }

  async createActivity(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes> {
    const dto: CreateActivityDto = {
      email: req.body.email,
      title: req.body.title,
    };

    return this.activityService.createActivity(dto);
  }

  async updateActivity(
    req: Request,
    res: Response
  ): Promise<ActivityAttributes> {
    const id = req.params.id;

    const dto: UpdateActivityDto = {
      ...(req.body.email !== undefined ? { email: req.body.email } : {}),
      ...(req.body.title !== undefined ? { title: req.body.title } : {}),
    };

    return this.activityService.updateActivity(+id, dto);
  }

  async deleteActivity(
    req: Request,
    res: Response
    // ): Promise<ActivityAttributes> {
  ): Promise<{}> {
    const id = req.params.id;

    // return this.activityService.deleteActivity(+id);

    await this.activityService.deleteActivity(+id);
    return {};
  }
}
