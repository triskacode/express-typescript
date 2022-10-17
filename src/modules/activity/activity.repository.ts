import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityRepository {
  constructor(private readonly activityEntity: typeof ActivityEntity) {}

  async createActivity(dto: CreateActivityDto): Promise<ActivityEntity> {
    const activity = await this.activityEntity.create(dto);

    return activity;
  }

  async getActivities(
    filter?: FilterGetActivitiesDto
  ): Promise<ActivityEntity[]> {
    const activities = await this.activityEntity.findAll({
      where: filter?.where,
      limit: filter?.take,
      offset: filter?.skip,
      order: filter?.orderBy,
    });

    return activities;
  }

  async getActivity(id: number): Promise<ActivityEntity | null> {
    const activity = await this.activityEntity.findByPk(id);

    return activity;
  }

  async updateActivity(
    entity: ActivityEntity,
    dto: UpdateActivityDto
  ): Promise<ActivityEntity> {
    await entity.update(dto);

    return entity;
  }

  async deleteActivity(entity: ActivityEntity): Promise<ActivityEntity> {
    await entity.destroy();

    return entity;
  }
}
