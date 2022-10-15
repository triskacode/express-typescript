import "dotenv/config";

export default {
  databaseUri: process.env.DATABASE_URI,
} as const;
