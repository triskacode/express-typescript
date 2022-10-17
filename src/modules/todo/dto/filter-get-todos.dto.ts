import { WhereOptions } from "sequelize";
import { TodoAttributes } from "../entities/types/todo.type";

type OrderQuery = [keyof TodoAttributes, "ASC" | "DESC"];

export interface FilterGetTodosDto {
  where?: WhereOptions<TodoAttributes>;
  skip?: number;
  take?: number;
  orderBy?: OrderQuery[];
}
