import { Cache } from "cache-manager";
import { OnAfterInitModule } from "common/types";
import { Module } from "common/types";
import { DatabaseService } from "database";
import { ActivityController } from "./activity.controller";
import { ActivityRepository } from "./activity.repository";
import { ActivityService } from "./activity.service";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityModule implements Module, OnAfterInitModule {
  controller: ActivityController;
  repository: ActivityRepository;
  service: ActivityService;

  constructor(databaseService: DatabaseService, cacheService: Cache) {
    const entity = databaseService.loadEntity(ActivityEntity);
    this.repository = new ActivityRepository(entity, cacheService);
    this.service = new ActivityService(this.repository);

    this.controller = new ActivityController(this.service);
  }

  onAfterInitModule(): void {
    ActivityEntity.loadRelation();
  }
}
