import cacheManager, { Cache } from "cache-manager";
import * as express from "express";
import { AppService } from "src/app";
import { httpRequestCachingMiddleware } from "src/common/middleware";
import { logger } from "src/common/utils";
import appConfig from "src/config/app.config";
import { DatabaseService } from "src/database";
import { ActivityModule } from "src/modules/activity";
import { TodoModule } from "src/modules/todo";

export class Application {
  readonly appService: AppService;
  readonly cacheService: Cache;
  readonly databaseService: DatabaseService;

  activityModule: ActivityModule;
  readonly todoModule: TodoModule;

  constructor() {
    this.appService = new AppService();
    this.cacheService = cacheManager.caching({ store: "memory", ttl: 5 });
    this.databaseService = new DatabaseService();

    // load all module
    this.activityModule = new ActivityModule(
      this.databaseService,
      this.cacheService
    );
    this.todoModule = new TodoModule(
      this.databaseService,
      this.cacheService,
      this.activityModule.repository
    );
  }

  async init(): Promise<express.Application> {
    // run post init module script
    this.activityModule.onAfterInitModule();
    this.todoModule.onAfterInitModule();

    // register global middleware
    // not working in clustering app must use external cache like redis
    this.appService.registerGlobalMiddleware(
      httpRequestCachingMiddleware(this.cacheService)
    );

    // load controller module into app
    this.appService.registerController(this.activityModule.controller);
    this.appService.registerController(this.todoModule.controller);

    await this.databaseService.testConnection();
    await this.databaseService.syncronizeDatabase();

    return this.appService.createHttpServer();
  }

  run() {
    return this.appService.runHttpServer(+appConfig.port, () =>
      logger.info(`app listening on port: ${appConfig.port}`)
    );
  }
}
