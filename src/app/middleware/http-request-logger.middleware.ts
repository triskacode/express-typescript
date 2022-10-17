import { logger } from "common/utils";
import morgan, { StreamOptions } from "morgan";

const stream: StreamOptions = {
  write: (message) => logger.http(message),
};

const skip = () => process.env.NODE_ENV === "production";

export const httpRequestLoggerMiddleware = morgan(
  ":method :url :status - :response-time ms",
  { stream, skip }
);
