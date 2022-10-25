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
    const activityService = new mockActivityService();
    activityController = new ActivityController(activityService);
  });

  describe("getActivities", () => {
    test("should call service with param filter limit 10 item by default", async () => {
      const request = { query: {} } as unknown as Request;
      const response = {} as unknown as Response;

      activityController.getActivities(request, response);

      expect(mockGetActivities).toHaveBeenCalledWith({ take: 10 });
    });

    test("should call service with param filter email when adding email field in request query", async () => {
      const request = {
        query: {
          email: "testing@mail.com",
        },
      } as unknown as Request;
      const response = {} as unknown as Response;

      activityController.getActivities(request, response);

      expect(mockGetActivities).toHaveBeenCalledWith({
        take: 10,
        where: { email: "testing@mail.com" },
      });
    });
  });

  describe("getActivity", () => {
    test("should call service with param id from request params", async () => {
      const request = { params: { id: 1 } } as unknown as Request;
      const response = {} as unknown as Response;

      activityController.getActivity(request, response);

      expect(mockGetActivity).toHaveBeenCalledWith(1);
    });
  });

  describe("createActivity", () => {
    test("should call service with param dto from request body", async () => {
      const mockEmail = "testing@gmail.com";
      const mockTitle = "testing title";
      const request = {
        body: {
          email: mockEmail,
          title: mockTitle,
        },
      } as unknown as Request;
      const response = {} as unknown as Response;

      activityController.createActivity(request, response);

      expect(mockCreateActivity).toHaveBeenCalledWith({
        email: mockEmail,
        title: mockTitle,
      });
    });
  });

  describe("updateActivity", () => {
    test("should call service with param id and dto from request params and body", async () => {
      const mockTitle = "testing title";
      const request = {
        params: { id: 1 },
        body: {
          title: mockTitle,
        },
      } as unknown as Request;
      const response = {} as unknown as Response;

      activityController.updateActivity(request, response);

      expect(mockUpdateActivity).toHaveBeenCalledWith(1, {
        title: mockTitle,
      });
    });
  });

  describe("deleteActivity", () => {
    test("should call service with param id from request params", async () => {
      const request = { params: { id: 1 } } as unknown as Request;
      const response = {} as unknown as Response;

      activityController.deleteActivity(request, response);

      expect(mockDeleteActivity).toHaveBeenCalledWith(1);
    });
  });
});
