import { AppException } from "common/exceptions";
import { ImplementableEntity } from "common/types";
import { logger } from "common/utils";
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
            process.env.NODE_ENV !== "production"
              ? (sql) => logger.debug(sql)
              : false,
          sync: { force: process.env.NODE_ENV !== "production" ? true : false },
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
