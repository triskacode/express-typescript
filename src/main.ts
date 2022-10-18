import cacheManager from "cache-manager";
import cluster from "cluster";
import { cpus } from "os";

import { logger } from "common/utils";
import appConfig from "config/app.config";
import { DatabaseService } from "database";
import { ActivityModule } from "modules/activity";
import { TodoModule } from "modules/todo";
import { AppService } from "./app";

const totalCPUs = cpus().length;
const cacheService = cacheManager.caching({ store: "memory", ttl: 5 });

function bootstrap() {
  try {
    const appService = new AppService(cacheService);
    const databaseService = new DatabaseService();

    const activityModule = new ActivityModule(databaseService, cacheService);
    const todoModule = new TodoModule(
      databaseService,
      cacheService,
      activityModule.repository
    );

    activityModule.onAfterInitModule();
    todoModule.onAfterInitModule();

    appService.loadController(activityModule.controller);
    appService.loadController(todoModule.controller);

    appService.listen(+appConfig.port, () =>
      logger.info(`app listening on port: ${appConfig.port}`)
    );
  } catch (error: any) {
    logger.error(error.message);
    process.exit(1);
  }
}

// bootstrap();

if (cluster.isPrimary) {
  logger.info(`Number of CPUs is ${totalCPUs}`);
  logger.info(`Master ${process.pid} is running`);

  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} died`);
    logger.info("Let's fork another worker!");
    cluster.fork();
  });
} else {
  logger.info(`Worker ${process.pid} started`);
  bootstrap();
}
