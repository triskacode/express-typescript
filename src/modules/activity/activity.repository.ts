import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { ActivityEntity } from "./entities/activity.entity";
import { ActivityAttributes } from "./entities/types/activity.type";

export class ActivityRepository {
  constructor(private readonly activityEntity: typeof ActivityEntity) {}

  async create(dto: CreateActivityDto): Promise<ActivityAttributes> {
    return this.activityEntity.create(dto);
  }

  async getActivities(
    filter?: FilterGetActivitiesDto
  ): Promise<ActivityAttributes[]> {
    return this.activityEntity.findAll({
      where: filter?.where,
      limit: filter?.take,
      offset: filter?.skip,
      order: filter?.orderBy,
    });
  }
}
