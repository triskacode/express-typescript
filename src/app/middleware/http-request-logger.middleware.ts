import { logger } from "common/utils";
import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

export const httpRequestLoggerMiddleware = morgan(
  ":method :url :status - :response-time ms",
  { stream }
);
