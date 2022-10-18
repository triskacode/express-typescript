import "dotenv/config";

export default {
  port: process.env.APP_PORT || 3030,
} as const;
