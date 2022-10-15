import { IController } from "common/interfaces";
import { IModule } from "common/interfaces";
import { DatabaseService } from "database";
import { ActivityController } from "./activity.controller";
import { ActivityRepository } from "./activity.repository";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityModule implements IModule {
  controller: IController;

  constructor(databaseService: DatabaseService) {
    const entity = databaseService.loadEntity(ActivityEntity);
    const activityRepository = new ActivityRepository(entity);

    this.controller = new ActivityController(activityRepository);
  }
}
