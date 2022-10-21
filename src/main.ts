import { Application } from "application";

async function bootstrap() {
  const app = new Application();
  await app.init();

  return app.run();
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
