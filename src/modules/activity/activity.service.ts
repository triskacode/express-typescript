import { BadRequestException, NotFoundException } from "common/exceptions";
import { ActivityRepository } from "./activity.repository";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { FilterGetActivitiesDto } from "./dto/filter-get-activities.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { ActivityEntity } from "./entities/activity.entity";
import { createActivityValidation } from "./validation/create-activity.validation";
import { updateActivityValidation } from "./validation/update-activity.validation";
import { getActivityValidation } from "./validation/get-activity.validation";
import { filterGetActivitiesValidation } from "./validation/filter-get-activities.validation";

export class ActivityService {
  constructor(private readonly activityRepository: ActivityRepository) {}

  async getActivities(
    filter?: FilterGetActivitiesDto
  ): Promise<ActivityEntity[]> {
    const { error: errorValidateFilter } =
      filterGetActivitiesValidation.validate(filter);

    if (errorValidateFilter) {
      throw new BadRequestException(errorValidateFilter.message);
    }

    const activities = await this.activityRepository.getActivities(filter);

    return activities;
  }

  async getActivity(id: number): Promise<ActivityEntity> {
    const { error: errorValidateId } = getActivityValidation.validate(id);

    if (errorValidateId) {
      throw new BadRequestException(errorValidateId.message);
    }

    const activity = await this.activityRepository.getActivity(id);

    if (!activity)
      throw new NotFoundException(`Activity with ID ${id} Not Found`);

    return activity;
  }

  async createActivity(dto: CreateActivityDto): Promise<ActivityEntity> {
    const { error: errorValidateDto } = createActivityValidation.validate(dto);

    if (errorValidateDto) {
      throw new BadRequestException(errorValidateDto.message);
    }

    const activity = await this.activityRepository.createActivity(dto);

    return activity;
  }

  async updateActivity(
    id: number,
    dto: UpdateActivityDto
  ): Promise<ActivityEntity> {
    const { error: errorValidateId } = getActivityValidation.validate(id);

    if (errorValidateId) {
      throw new BadRequestException(errorValidateId.message);
    }

    const { error: errorValidateDto } = updateActivityValidation.validate(dto);

    if (errorValidateDto) {
      throw new BadRequestException(errorValidateDto.message);
    }

    const activity = await this.activityRepository.getActivity(+id);

    if (!activity)
      throw new NotFoundException(`Activity with ID ${id} Not Found`);

    const updatedActivity = await this.activityRepository.updateActivity(
      activity,
      dto
    );

    return updatedActivity;
  }

  async deleteActivity(id: number): Promise<ActivityEntity> {
    const { error: errorValidateId } = getActivityValidation.validate(id);

    if (errorValidateId) {
      throw new BadRequestException(errorValidateId.message);
    }

    const activity = await this.activityRepository.getActivity(id);

    if (!activity)
      throw new NotFoundException(`Activity with ID ${id} Not Found`);

    const deletedActivity = await this.activityRepository.deleteActivity(
      activity
    );

    return deletedActivity;
  }
}
