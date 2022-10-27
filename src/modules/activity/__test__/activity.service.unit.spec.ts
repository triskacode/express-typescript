import { ValidationError } from "joi";
import { BadRequestException, NotFoundException } from "src/common/exceptions";
import { ActivityRepository } from "../activity.repository";
import { ActivityService } from "../activity.service";
import { filterGetActivitiesValidation } from "../validation/filter-get-activities.validation";
import { getActivityValidation } from "../validation/get-activity.validation";
import { createActivityValidation } from "../validation/create-activity.validation";
import { updateActivityValidation } from "../validation/update-activity.validation";

jest.mock("../validation/filter-get-activities.validation");
jest.mock("../validation/get-activity.validation");
jest.mock("../validation/create-activity.validation");
jest.mock("../validation/update-activity.validation");

const mockFilterGetActivitiesValidation = jest.mocked(
  filterGetActivitiesValidation
);
const mockGetActivityValidation = jest.mocked(getActivityValidation);
const mockCreateActivityValidation = jest.mocked(createActivityValidation);
const mockUpdateActivityValidation = jest.mocked(updateActivityValidation);

const mockGetActivities = jest.fn();
const mockGetActivity = jest.fn();
const mockCreateActivity = jest.fn();
const mockUpdateActivity = jest.fn();
const mockDeleteActivity = jest.fn();
const mockActivityRepository = jest.fn(
  () =>
    ({
      getActivities: mockGetActivities,
      getActivity: mockGetActivity,
      createActivity: mockCreateActivity,
      updateActivity: mockUpdateActivity,
      deleteActivity: mockDeleteActivity,
    } as unknown as ActivityRepository)
);

describe("ActivityService", () => {
  let activityService: ActivityService;

  beforeEach(() => {
    const activityRepository = new mockActivityRepository();
    activityService = new ActivityService(activityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getActivities", () => {
    beforeEach(() => {
      mockGetActivities.mockImplementation((args) => []);
      mockFilterGetActivitiesValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given filter param", async () => {
      const fakeFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      await activityService.getActivities(fakeFilter);

      expect(mockFilterGetActivitiesValidation.validate).toHaveBeenCalledWith(
        fakeFilter
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      mockFilterGetActivitiesValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.getActivities(fakeFilter)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should call repository with param validated filter", async () => {
      const fakeFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      await expect(activityService.getActivities(fakeFilter)).resolves.toEqual(
        []
      );

      expect(mockGetActivities).toBeCalledWith(fakeFilter);
    });
  });

  describe("getActivity", () => {
    beforeEach(() => {
      mockGetActivity.mockImplementation((args) => ({}));
      mockGetActivityValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given id param", async () => {
      const fakeId = 1;

      await activityService.getActivity(fakeId);

      expect(mockGetActivityValidation.validate).toHaveBeenCalledWith(fakeId);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.getActivity(fakeId)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should call repository with param validated id", async () => {
      const fakeId = 1;

      await expect(activityService.getActivity(fakeId)).resolves.toEqual({});

      expect(mockGetActivity).toBeCalledWith(fakeId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const fakeId = 1;

      mockGetActivity.mockReturnValue(undefined);

      await expect(activityService.getActivity(fakeId)).rejects.toThrow(
        new NotFoundException(`Activity with ID ${fakeId} Not Found`)
      );
    });
  });

  describe("createActivity", () => {
    beforeEach(() => {
      mockCreateActivity.mockImplementation((args) => ({}));
      mockCreateActivityValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given dto param", async () => {
      const fakeDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      await activityService.createActivity(fakeDto);

      expect(mockCreateActivityValidation.validate).toHaveBeenCalledWith(
        fakeDto
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      mockCreateActivityValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.createActivity(fakeDto)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should call repository with param validated dto", async () => {
      const fakeDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      await expect(activityService.createActivity(fakeDto)).resolves.toEqual(
        {}
      );

      expect(mockCreateActivity).toBeCalledWith(fakeDto);
    });
  });

  describe("updateActivity", () => {
    beforeEach(() => {
      mockGetActivity.mockImplementation((args) => ({}));
      mockUpdateActivity.mockImplementation((args) => ({}));
      mockGetActivityValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
      mockUpdateActivityValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given id and dto param", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      await activityService.updateActivity(fakeId, fakeDto);

      expect(mockGetActivityValidation.validate).toHaveBeenCalledWith(fakeId);
      expect(mockUpdateActivityValidation.validate).toHaveBeenCalledWith(
        fakeDto
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      mockGetActivityValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });
      mockUpdateActivityValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(
        activityService.updateActivity(fakeId, fakeDto)
      ).rejects.toThrow(new BadRequestException(fakeErrorMessage));
    });

    test("should validate given param id to activityRepository", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      await activityService.updateActivity(fakeId, fakeDto);

      expect(mockGetActivity).toBeCalledWith(fakeId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      mockGetActivity.mockReturnValue(undefined);

      await expect(
        activityService.updateActivity(fakeId, fakeDto)
      ).rejects.toThrow(
        new NotFoundException(`Activity with ID ${fakeId} Not Found`)
      );
    });

    test("should call updateActivity repository with param activityEntity and dto", async () => {
      const fakeId = 1;
      const fakeActivityEntity = {};
      const fakeDto = {
        title: "testing title",
      };

      await expect(
        activityService.updateActivity(fakeId, fakeDto)
      ).resolves.toEqual({});

      expect(mockUpdateActivity).toBeCalledWith(fakeActivityEntity, fakeDto);
    });
  });

  describe("deleteActivity", () => {
    beforeEach(() => {
      mockGetActivity.mockImplementation((args) => ({}));
      mockDeleteActivity.mockImplementation((args) => ({}));
      mockGetActivityValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given id param", async () => {
      const fakeId = 1;

      await activityService.deleteActivity(fakeId);

      expect(mockGetActivityValidation.validate).toHaveBeenCalledWith(fakeId);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.deleteActivity(fakeId)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should validate given param id to activityRepository", async () => {
      const fakeId = 1;

      await activityService.deleteActivity(fakeId);

      expect(mockGetActivity).toBeCalledWith(fakeId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const fakeId = 1;

      mockGetActivity.mockReturnValue(undefined);

      await expect(activityService.deleteActivity(fakeId)).rejects.toThrow(
        new NotFoundException(`Activity with ID ${fakeId} Not Found`)
      );
    });

    test("should call deleteActivity repository with param activityEntity", async () => {
      const fakeId = 1;
      const fakeActivityEntity = {};

      await expect(activityService.deleteActivity(fakeId)).resolves.toEqual({});

      expect(mockDeleteActivity).toBeCalledWith(fakeActivityEntity);
    });
  });
});
