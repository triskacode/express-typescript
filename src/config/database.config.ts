import "dotenv/config";

const host = process.env.MYSQL_HOST;
const port = process.env.MYSQL_PORT ?? 3306;
const user = process.env.MYSQL_USER;
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DBNAME;

export default {
  databaseUri: `mysql://${user}:${password}@${host}:${port}/${database}`,
} as const;
