import { NotFoundException } from "common/exceptions";
import { ActivityRepository } from "./activity.repository";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityEntity } from "./entities/activity.entity";

export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async getActivities(
    filter?: FilterGetActivitiesDto
  ): Promise<ActivityEntity[]> {
    const activities = await this.activityRepository.getActivities(filter);

    return activities;
  }

  async getActivity(id: number): Promise<ActivityEntity> {
    const activity = await this.activityRepository.getActivity(id);

    if (!activity)
      throw new NotFoundException(`Activity with id: ${id} not found`);

    return activity;
  }

  async createActivity(dto: CreateActivityDto): Promise<ActivityEntity> {
    const activity = await this.activityRepository.createActivity(dto);

    return activity;
  }

  async updateActivity(
    id: number,
    dto: UpdateActivityDto
  ): Promise<ActivityEntity> {
    const activity = await this.activityRepository.getActivity(+id);

    if (!activity)
      throw new NotFoundException(`Activity with id: ${id} not found`);

    const updatedActivity = await this.activityRepository.updateActivity(
      activity,
      dto
    );

    return updatedActivity;
  }

  async deleteActivity(id: number): Promise<ActivityEntity> {
    const activity = await this.activityRepository.getActivity(id);

    if (!activity)
      throw new NotFoundException(`Activity with id: ${id} not found`);

    const deletedActivity = await this.activityRepository.deleteActivity(
      activity
    );

    return deletedActivity;
  }
}
