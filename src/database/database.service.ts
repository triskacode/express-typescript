import { Sequelize } from "sequelize";
import { AppException } from "src/common/exceptions";
import { ImplementableEntity } from "src/common/types";
import { logger } from "src/common/utils";
import appConfig from "src/config/app.config";
import databaseConfig from "src/config/database.config";

export class DatabaseService {
  private databaseConnection: Sequelize;

  getConnection() {
    if (!this.databaseConnection) {
      if (!databaseConfig.databaseUri) {
        throw new AppException("Database uri doesn't exist.");
      } else {
        this.databaseConnection = new Sequelize(databaseConfig.databaseUri, {
          logging:
            appConfig.environment === "development"
              ? (sql) => logger.debug(sql)
              : false,
          pool: {
            max: 10,
            min: 0,
            idle: 20000,
            acquire: 3000,
          },
        });
      }
    }

    return this.databaseConnection;
  }

  async testConnection(): Promise<void> {
    await this.getConnection().authenticate();
  }

  async syncronizeDatabase(): Promise<void> {
    if (appConfig.environment !== "production") {
      await this.getConnection().sync({ force: true });
    }
  }

  loadEntity<Entity extends ImplementableEntity>(entity: Entity): Entity {
    entity.initialize(this.getConnection());

    return entity;
  }
}
