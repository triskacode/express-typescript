import "dotenv/config";

export default {
  databaseUri:
    process.env.NODE_ENV === "production"
      ? `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${
          process.env.MYSQL_HOST
        }:${process.env.MYSQL_PORT ?? 3306}/${process.env.MYSQL_DBNAME}`
      : process.env.DATABASE_URI,
} as const;
