import cacheManager from "cache-manager";
import { httpRequestCachingMiddleware } from "common/middleware/http-request-caching.middleware";

import { logger } from "common/utils";
import appConfig from "config/app.config";
import { DatabaseService } from "database";
import { ActivityModule } from "modules/activity";
import { TodoModule } from "modules/todo";
import { AppService } from "./app";

async function bootstrap() {
  try {
    const appService = new AppService();
    const cacheService = cacheManager.caching({ store: "memory", ttl: 5 });
    const databaseService = new DatabaseService();

    await databaseService.testConnection();

    // load all module
    const activityModule = new ActivityModule(databaseService, cacheService);
    const todoModule = new TodoModule(
      databaseService,
      cacheService,
      activityModule.repository
    );

    // run post init module script
    activityModule.onAfterInitModule();
    todoModule.onAfterInitModule();

    // register global middleware
    // not working in clustering app must use external cache like redis
    appService.registerGlobalMiddleware(
      httpRequestCachingMiddleware(cacheService)
    );

    // load controller module into app
    appService.registerController(activityModule.controller);
    appService.registerController(todoModule.controller);

    appService.runHttpServer(+appConfig.port, () =>
      logger.info(`app listening on port: ${appConfig.port}`)
    );
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }
}

bootstrap();

// const totalCPUs = cpus().length;

// if (cluster.isPrimary) {
//   logger.info(`Number of CPUs is ${totalCPUs}`);
//   logger.info(`Master ${process.pid} is running`);

//   for (let i = 0; i < totalCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker, code, signal) => {
//     logger.info(`Worker ${worker.process.pid} died`);
//     logger.info("Let's fork another worker!");
//     cluster.fork();
//   });
// } else {
//   logger.info(`Worker ${process.pid} started`);
//   bootstrap();
// }
