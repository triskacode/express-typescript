import { Cache } from "cache-manager";
import { OnAfterInitModule } from "src/common/types";
import { Module } from "src/common/types";
import { DatabaseService } from "src/database";
import { ActivityController } from "./activity.controller";
import { ActivityRepository } from "./activity.repository";
import { ActivityService } from "./activity.service";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityModule implements Module, OnAfterInitModule {
  readonly controller: ActivityController;
  readonly repository: ActivityRepository;
  readonly service: ActivityService;

  constructor(databaseService: DatabaseService, cacheService: Cache) {
    databaseService.loadEntity(ActivityEntity);

    this.repository = new ActivityRepository(cacheService);
    this.service = new ActivityService(this.repository);
    this.controller = new ActivityController(this.service);
  }

  onAfterInitModule(): void {
    ActivityEntity.loadRelation();
  }
}
