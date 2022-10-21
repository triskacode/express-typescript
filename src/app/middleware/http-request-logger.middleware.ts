import morgan, { StreamOptions } from "morgan";
import { logger } from "src/common/utils";

const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

export const httpRequestLoggerMiddleware = morgan(
  ":method :url :status - :response-time ms",
  { stream }
);
