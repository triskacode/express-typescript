import appConfig from "config/app.config";
import { ActivityController } from "modules/activity";
import { AppService } from "./app";

function bootstrap() {
  const appService = new AppService();

  appService.registerController(new ActivityController());

  appService.listen(+appConfig.port, () =>
    console.log(`app listening on port: ${appConfig.port}`)
  );
}

bootstrap();
