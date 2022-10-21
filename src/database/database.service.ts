import { AppException } from "common/exceptions";
import { ImplementableEntity } from "common/types";
import { logger } from "common/utils";
import appConfig from "config/app.config";
import databaseConfig from "config/database.config";
import { Sequelize } from "sequelize";

export class DatabaseService {
  private databaseConnection: Sequelize;

  getConnection() {
    if (!this.databaseConnection) {
      if (!databaseConfig.databaseUri) {
        throw new AppException("Database uri doesn't exist.");
      } else {
        this.databaseConnection = new Sequelize(databaseConfig.databaseUri, {
          logging:
            appConfig.environment === "production"
              ? false
              : (sql) => logger.debug(sql),
          sync: {
            force: appConfig.environment === "production" ? false : true,
          },
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

  async testConnection() {
    await this.getConnection().authenticate();
  }

  loadEntity<Entity extends ImplementableEntity>(entity: Entity) {
    entity.initialize(this.getConnection());
    this.getConnection().sync();

    return entity;
  }
}
