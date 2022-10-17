import appConfig from "config/app.config";
import { DatabaseService } from "database";
import { ActivityModule } from "modules/activity";
import { AppService } from "./app";

import cluster from "cluster";
import { cpus } from "os";
import { TodoModule } from "modules/todo/todo.module";
import { logger } from "common/utils";

function bootstrap() {
  try {
    const appService = new AppService();
    const databaseService = new DatabaseService();

    const activityModule = new ActivityModule(databaseService);
    const todoModule = new TodoModule(
      databaseService,
      activityModule.repository
    );

    activityModule.onAfterInitModule();
    todoModule.onAfterInitModule();

    appService.loadController(activityModule.controller);
    appService.loadController(todoModule.controller);

    appService.listen(+appConfig.port, () =>
      console.log(`app listening on port: ${appConfig.port}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

// bootstrap();

const totalCPUs = cpus().length;

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
