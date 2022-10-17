import { ImplementStaticInterface } from "common/decorators";
import { ImplementableEntity, ImplementableRelationEntity } from "common/types";
import { TodoEntity } from "modules/todo/entities/todo.entity";
import { DataTypes, Model, Sequelize } from "sequelize";
import {
  ActivityAttributes,
  ActivityCreationAttributes,
} from "./types/activity.type";

@ImplementStaticInterface<ImplementableEntity & ImplementableRelationEntity>()
export class ActivityEntity extends Model<
  ActivityAttributes,
  ActivityCreationAttributes
> {
  title: string;
  email: string;

  id: number;
  created_at: Date;
  updated_at: Date;

  static initialize(connection: Sequelize) {
    ActivityEntity.init(
      {
        title: DataTypes.STRING,
        email: DataTypes.STRING,
      },
      { sequelize: connection, tableName: "activities" }
    );
  }

  static loadRelation() {
    ActivityEntity.hasMany(TodoEntity, {
      foreignKey: "activity_group_id",
      sourceKey: "id",
    });
  }
}
