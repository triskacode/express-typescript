import { WhereOptions } from "sequelize";
import { ActivityAttributes } from "../entities/types/activity.type";

type OrderQuery = [keyof ActivityAttributes, "ASC" | "DESC"];

export interface FilterGetActivitiesDto {
  where?: WhereOptions<ActivityAttributes>;
  skip?: number;
  take?: number;
  orderBy?: OrderQuery[];
}
