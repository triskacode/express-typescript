import { ImplementStaticInterface } from "common/decorators";
import { ImplementableEntity, ImplementableRelationEntity } from "common/types";
import { ActivityEntity } from "modules/activity/entities/activity.entity";
import { DataTypes, Model, Sequelize } from "sequelize";
import {
  Priority,
  TodoAttributes,
  TodoCreationAttributes,
} from "./types/todo.type";

@ImplementStaticInterface<ImplementableEntity & ImplementableRelationEntity>()
export class TodoEntity extends Model<TodoAttributes, TodoCreationAttributes> {
  title: string;
  is_active: boolean;
  priority: Priority;

  activity_group_id: number;

  id: number;
  created_at: Date;
  updated_at: Date;

  static initialize(connection: Sequelize) {
    TodoEntity.init(
      {
        title: DataTypes.STRING,
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
        priority: {
          type: DataTypes.ENUM(...Object.values(Priority)),
          defaultValue: Priority.VeryHigh,
        },
        activity_group_id: DataTypes.NUMBER,
      },
      { sequelize: connection, tableName: "todos" }
    );
  }

  static loadRelation() {
    TodoEntity.belongsTo(ActivityEntity, {
      foreignKey: "activity_group_id",
      targetKey: "id",
    });
  }
}
