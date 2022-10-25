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
    mockGetActivities.mockImplementation((args) => [] as any);
    mockGetActivity.mockImplementation((args) => ({} as any));
    mockCreateActivity.mockImplementation((args) => ({} as any));
    mockUpdateActivity.mockImplementation((args) => ({} as any));
    mockDeleteActivity.mockImplementation((args) => ({} as any));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    const activityRepository = new mockActivityRepository();
    activityService = new ActivityService(activityRepository);
  });

  describe("getActivities", () => {
    test("should validate given filter param", async () => {
      const mockFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      mockFilterGetActivitiesValidation.validate.mockReturnValue({
        error: undefined,
        value: {},
      });

      await activityService.getActivities(mockFilter);

      expect(mockFilterGetActivitiesValidation.validate).toHaveBeenCalledWith(
        mockFilter
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const mockErrorMessage = "Some Error Message";
      const mockFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      mockFilterGetActivitiesValidation.validate.mockReturnValue({
        error: new Error(mockErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.getActivities(mockFilter)).rejects.toThrow(
        new BadRequestException(mockErrorMessage)
      );
    });

    test("should call repository with param validated filter", async () => {
      const mockEmail = "testing@mail.com";
      const mockFilter = {
        take: 10,
        where: { email: mockEmail },
      };

      mockFilterGetActivitiesValidation.validate.mockReturnValue({
        error: undefined,
        value: {},
      });

      await expect(activityService.getActivities(mockFilter)).resolves.toEqual(
        []
      );

      expect(mockGetActivities).toBeCalledWith(mockFilter);
    });
  });

  describe("getActivity", () => {
    test("should validate given id param", async () => {
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });

      await activityService.getActivity(mockId);

      expect(mockGetActivityValidation.validate).toHaveBeenCalledWith(mockId);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const mockErrorMessage = "Some Error Message";
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: new Error(mockErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.getActivity(mockId)).rejects.toThrow(
        new BadRequestException(mockErrorMessage)
      );
    });

    test("should call repository with param validated id", async () => {
      const mockEmail = "testing@mail.com";
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });

      await expect(activityService.getActivity(mockId)).resolves.toEqual({});

      expect(mockGetActivity).toBeCalledWith(mockId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });
      mockGetActivity.mockImplementation((id) => undefined);

      await expect(activityService.getActivity(mockId)).rejects.toThrow(
        new NotFoundException(`Activity with ID ${mockId} Not Found`)
      );
    });
  });

  describe("createActivity", () => {
    test("should validate given dto param", async () => {
      const mockDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      mockCreateActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockDto,
      });

      await activityService.createActivity(mockDto);

      expect(mockCreateActivityValidation.validate).toHaveBeenCalledWith(
        mockDto
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const mockErrorMessage = "Some Error Message";
      const mockDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      mockCreateActivityValidation.validate.mockReturnValue({
        error: new Error(mockErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.createActivity(mockDto)).rejects.toThrow(
        new BadRequestException(mockErrorMessage)
      );
    });

    test("should call repository with param validated dto", async () => {
      const mockDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      mockCreateActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockDto,
      });
      await expect(activityService.createActivity(mockDto)).resolves.toEqual(
        {}
      );

      expect(mockCreateActivity).toBeCalledWith(mockDto);
    });
  });

  describe("updateActivity", () => {
    test("should validate given id and dto param", async () => {
      const mockId = 1;
      const mockDto = {
        title: "testing title",
      };

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });
      mockUpdateActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockDto,
      });

      await activityService.updateActivity(mockId, mockDto);

      expect(mockGetActivityValidation.validate).toHaveBeenCalledWith(mockId);
      expect(mockUpdateActivityValidation.validate).toHaveBeenCalledWith(
        mockDto
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const mockErrorMessage = "Some Error Message";
      const mockId = 1;
      const mockDto = {
        title: "testing title",
      };

      mockGetActivityValidation.validate.mockReturnValue({
        error: new Error(mockErrorMessage) as ValidationError,
        value: undefined,
      });
      mockUpdateActivityValidation.validate.mockReturnValue({
        error: new Error(mockErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(
        activityService.updateActivity(mockId, mockDto)
      ).rejects.toThrow(new BadRequestException(mockErrorMessage));
    });

    test("should call getActivity and updateActivity repository with param validated id and dto", async () => {
      const mockId = 1;
      const mockDto = {
        title: "testing title",
      };

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });
      mockUpdateActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockDto,
      });

      await expect(
        activityService.updateActivity(mockId, mockDto)
      ).resolves.toEqual({});

      expect(mockGetActivity).toBeCalledWith(mockId);
      expect(mockUpdateActivity).toBeCalledWith({}, mockDto);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const mockId = 1;
      const mockDto = {
        title: "testing title",
      };

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });
      mockUpdateActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockDto,
      });

      mockGetActivity.mockImplementation((id) => undefined);

      await expect(
        activityService.updateActivity(mockId, mockDto)
      ).rejects.toThrow(
        new NotFoundException(`Activity with ID ${mockId} Not Found`)
      );
    });
  });

  describe("deleteActivity", () => {
    test("should validate given id param", async () => {
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });

      await activityService.deleteActivity(mockId);

      expect(mockGetActivityValidation.validate).toHaveBeenCalledWith(mockId);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const mockErrorMessage = "Some Error Message";
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: new Error(mockErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(activityService.deleteActivity(mockId)).rejects.toThrow(
        new BadRequestException(mockErrorMessage)
      );
    });

    test("should call getActivity and deleteActivity repository with param validated id", async () => {
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });

      await expect(activityService.deleteActivity(mockId)).resolves.toEqual({});

      expect(mockGetActivity).toBeCalledWith(mockId);
      expect(mockDeleteActivity).toBeCalledWith({});
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const mockId = 1;

      mockGetActivityValidation.validate.mockReturnValue({
        error: undefined,
        value: mockId,
      });
      mockGetActivity.mockImplementation((id) => undefined);

      await expect(activityService.deleteActivity(mockId)).rejects.toThrow(
        new NotFoundException(`Activity with ID ${mockId} Not Found`)
      );
    });
  });
});
