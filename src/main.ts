import { AppException } from "common/exceptions";
import appConfig from "config/app.config";
import { DatabaseService } from "database";
import { ActivityModule } from "modules/activity";
import { AppService } from "./app";

function bootstrap() {
  try {
    const appService = new AppService();
    const databaseService = new DatabaseService();

    const activityModule = new ActivityModule(databaseService);
    appService.loadController(activityModule.controller);

    appService.listen(+appConfig.port, () =>
      console.log(`app listening on port: ${appConfig.port}`)
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

bootstrap();
