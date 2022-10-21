import { Cache } from "cache-manager";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityRepository {
  private readonly baseCacheKey = "activity-repository";

  constructor(private readonly cacheService: Cache) {}

  async createActivity(dto: CreateActivityDto): Promise<ActivityEntity> {
    const activity = await ActivityEntity.create(dto);

    return activity;
  }

  async getActivities(
    filter?: FilterGetActivitiesDto
  ): Promise<ActivityEntity[]> {
    const activities = await ActivityEntity.findAll({
      where: filter?.where,
      limit: filter?.take,
      offset: filter?.skip,
      order: filter?.orderBy,
    });

    return activities;
  }

  async getActivity(id: number): Promise<ActivityEntity | null> {
    const cacheKey = `${this.baseCacheKey}-activity-${id}`;
    const cache = (await this.cacheService.get(cacheKey)) as ActivityEntity;

    if (cache) return cache;

    const activity = await ActivityEntity.findByPk(id);

    this.cacheService.set(cacheKey, activity, { ttl: 60 });

    return activity;
  }

  async updateActivity(
    entity: ActivityEntity,
    dto: UpdateActivityDto
  ): Promise<ActivityEntity> {
    const cacheKey = `${this.baseCacheKey}-activity-${entity.id}`;
    await entity.update(dto);

    this.cacheService.del(cacheKey);
    return entity;
  }

  async deleteActivity(entity: ActivityEntity): Promise<ActivityEntity> {
    const cacheKey = `${this.baseCacheKey}-activity-${entity.id}`;
    await entity.destroy();

    this.cacheService.del(cacheKey);
    return entity;
  }
}
