import { Cache } from "cache-manager";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityRepository {
  private readonly baseCacheKey = "activity-repository";

  constructor(
    private readonly activityEntity: typeof ActivityEntity,
    private readonly cacheService: Cache
  ) {}

  async createActivity(dto: CreateActivityDto): Promise<ActivityEntity> {
    const activity = await this.activityEntity.create(dto);

    this.clearCache();

    return activity;
  }

  async getActivities(
    filter?: FilterGetActivitiesDto
  ): Promise<ActivityEntity[]> {
    const cacheKey = this.getCacheKey("get-activities", filter);
    const cache = (await this.cacheService.get(cacheKey)) as ActivityEntity[];

    if (cache) return cache;

    const activities = await this.activityEntity.findAll({
      where: filter?.where,
      limit: filter?.take,
      offset: filter?.skip,
      order: filter?.orderBy,
    });

    this.cacheService.set(cacheKey, activities, { ttl: 60 });

    return activities;
  }

  async getActivity(id: number): Promise<ActivityEntity | null> {
    const cacheKey = this.getCacheKey("get-activity", id.toString());
    const cache = (await this.cacheService.get(cacheKey)) as ActivityEntity;

    if (cache) return cache;

    const activity = await this.activityEntity.findByPk(id);

    this.cacheService.set(cacheKey, activity, { ttl: 60 });

    return activity;
  }

  async updateActivity(
    entity: ActivityEntity,
    dto: UpdateActivityDto
  ): Promise<ActivityEntity> {
    await entity.update(dto);

    this.clearCache();

    return entity;
  }

  async deleteActivity(entity: ActivityEntity): Promise<ActivityEntity> {
    await entity.destroy();

    this.clearCache();

    return entity;
  }

  private getCacheKey(uniqueKey: string, keys?: string | Record<string, any>) {
    const keyStr = keys
      ? typeof keys === "string"
        ? `key=${keys}`
        : Object.keys(keys)
            .map((key) => `${key}=${keys[key]}`)
            .join(",")
      : "";

    return `${this.baseCacheKey}-${uniqueKey}${
      keyStr ? `?${keyStr.toLocaleLowerCase()}` : ""
    }`;
  }

  private async clearCache() {
    const keys = (await this.cacheService.store.keys?.()) as string[];
    const matchedKeys = await keys.filter((key) =>
      key.match(new RegExp(this.baseCacheKey, "g"))
    );

    if (matchedKeys.length > 0) {
      await matchedKeys.map(async (key) => {
        await this.cacheService.del(key);
      });
    }
  }
}
