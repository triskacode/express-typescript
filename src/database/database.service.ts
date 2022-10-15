import { AppException } from "common/exceptions";
import { ImplementableEntity } from "common/interfaces";
import databaseConfig from "config/database.config";
import { Sequelize } from "sequelize";

export class DatabaseService {
  private databaseConnection: Sequelize;

  getConnection() {
    if (!this.databaseConnection) {
      if (!databaseConfig.databaseUri) {
        throw new AppException("Database uri doesn't exist.");
      } else {
        this.databaseConnection = new Sequelize(databaseConfig.databaseUri);
      }
    }

    return this.databaseConnection;
  }

  loadEntity<Entity extends ImplementableEntity>(entity: Entity) {
    entity.initialize(this.getConnection());
    this.getConnection().sync({ force: true });

    return entity;
  }
}
