import { AppService } from "app/app.service";
import cacheManager, { Cache } from "cache-manager";
import { httpRequestCachingMiddleware } from "common/middleware/http-request-caching.middleware";
import { logger } from "common/utils";
import appConfig from "config/app.config";
import { DatabaseService } from "database";
import * as express from "express";
import { ActivityModule } from "modules/activity";
import { TodoModule } from "modules/todo";

export class Application {
  private appService: AppService;
  private cacheService: Cache;
  private databaseService: DatabaseService;

  private activityModule: ActivityModule;
  private todoModule: TodoModule;

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
