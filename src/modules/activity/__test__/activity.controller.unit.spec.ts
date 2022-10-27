import { ActivityService } from "../activity.service";
import { ActivityController } from "../activity.controller";
import { Request, Response } from "express";

const mockGetActivities = jest.fn();
const mockGetActivity = jest.fn();
const mockCreateActivity = jest.fn();
const mockUpdateActivity = jest.fn();
const mockDeleteActivity = jest.fn();
const mockActivityService = jest.fn(
  () =>
    ({
      getActivities: mockGetActivities,
      getActivity: mockGetActivity,
      createActivity: mockCreateActivity,
      updateActivity: mockUpdateActivity,
      deleteActivity: mockDeleteActivity,
    } as unknown as ActivityService)
);

describe("ActivityController", () => {
  let activityController: ActivityController;

  beforeEach(() => {
    const activityService = new mockActivityService();
    activityController = new ActivityController(activityService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getActivities", () => {
    beforeEach(() => {
      mockGetActivities.mockImplementation((args) => []);
    });

    test("should call service with param filter limit 10 item by default", async () => {
      const fakeRequest = { query: {} } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await activityController.getActivities(fakeRequest, fakeResponse);

      expect(mockGetActivities).toHaveBeenCalledWith({ take: 10 });
    });

    test("should call service with param filter email when adding email field in request query", async () => {
      const fakeEmail = "testing@mail.com";
      const fakeRequest = {
        query: {
          email: fakeEmail,
        },
      } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await activityController.getActivities(fakeRequest, fakeResponse);

      expect(mockGetActivities).toHaveBeenCalledWith({
        take: 10,
        where: { email: fakeEmail },
      });
    });
  });

  describe("getActivity", () => {
    beforeEach(() => {
      mockGetActivity.mockImplementation((args) => ({}));
    });

    test("should call service with param id from request params", async () => {
      const fakeId = 1;
      const fakeRequest = { params: { id: fakeId } } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await activityController.getActivity(fakeRequest, fakeResponse);

      expect(mockGetActivity).toHaveBeenCalledWith(fakeId);
    });
  });

  describe("createActivity", () => {
    beforeEach(() => {
      mockCreateActivity.mockImplementation((args) => ({}));
    });

    test("should call service with param dto from request body", async () => {
      const fakeEmail = "testing@gmail.com";
      const fakeTitle = "testing title";
      const fakeRequest = {
        body: {
          email: fakeEmail,
          title: fakeTitle,
        },
      } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await activityController.createActivity(fakeRequest, fakeResponse);

      expect(mockCreateActivity).toHaveBeenCalledWith({
        email: fakeEmail,
        title: fakeTitle,
      });
    });
  });

  describe("updateActivity", () => {
    beforeEach(() => {
      mockUpdateActivity.mockImplementation((args) => ({}));
    });

    test("should call service with param id and dto from request params and body", async () => {
      const fakeId = 1;
      const fakeTitle = "testing title";
      const fakeRequest = {
        params: { id: fakeId },
        body: {
          title: fakeTitle,
        },
      } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await activityController.updateActivity(fakeRequest, fakeResponse);

      expect(mockUpdateActivity).toHaveBeenCalledWith(fakeId, {
        title: fakeTitle,
      });
    });
  });

  describe("deleteActivity", () => {
    beforeEach(() => {
      mockDeleteActivity.mockImplementation((args) => ({}));
    });

    test("should call service with param id from request params", async () => {
      const fakeId = 1;
      const fakeRequest = { params: { id: fakeId } } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await activityController.deleteActivity(fakeRequest, fakeResponse);

      expect(mockDeleteActivity).toHaveBeenCalledWith(fakeId);
    });
  });
});
