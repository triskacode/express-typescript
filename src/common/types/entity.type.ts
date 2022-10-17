import { Sequelize } from "sequelize";

export interface ImplementableEntity {
  initialize(connection: Sequelize): void;
}

export interface ImplementableRelationEntity {
  loadRelation(): void;
}
