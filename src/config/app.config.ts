import "dotenv/config";

export default {
  environment: process.env.NODE_ENV,
  port: process.env.APP_PORT || 3030,
} as const;
