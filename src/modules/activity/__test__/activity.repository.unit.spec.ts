import { Cache } from "cache-manager";
import { ActivityRepository } from "../activity.repository";
import { ActivityEntity } from "../entities/activity.entity";

jest.mock("../entities/activity.entity");

const mockActivityEntity = jest.mocked(ActivityEntity);

const mockCacheGet = jest.fn();
const mockCacheSet = jest.fn();
const mockCacheDel = jest.fn();
const mockCacheService = jest.fn(
  () =>
    ({
      get: mockCacheGet,
      set: mockCacheSet,
      del: mockCacheDel,
    } as unknown as Cache)
);

describe("ActivityRepository", () => {
  const baseCacheKey = "activity-repository";
  let activityRepository: ActivityRepository;

  beforeEach(() => {
    mockCacheGet.mockImplementation((...args) => ({} as any));
    mockCacheSet.mockImplementation((...args) => ({} as any));
    mockCacheDel.mockImplementation((...args) => ({} as any));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    const cacheService = new mockCacheService();
    activityRepository = new ActivityRepository(cacheService);
  });

  describe("createActivity", () => {
    test("should call create on ActivityEntity with dto param", async () => {
      const mockDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      await activityRepository.createActivity(mockDto);

      expect(mockActivityEntity.create).toHaveBeenCalledWith(mockDto);
    });
  });

  describe("getActivities", () => {
    test("should call findAll on ActivityEntity with filter param", async () => {
      const mockFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      await activityRepository.getActivities(mockFilter);

      expect(mockActivityEntity.findAll).toHaveBeenCalledWith({
        where: mockFilter.where,
        limit: mockFilter.take,
        offset: undefined,
        order: undefined,
      });
    });
  });

  describe("getActivity", () => {
    test("should check to cache if given param id is already exist, return it", async () => {
      const mockId = 1;
      const mockCacheKey = `${baseCacheKey}-activity-${mockId}`;

      mockCacheGet.mockImplementation(() => ({}));

      await expect(activityRepository.getActivity(mockId)).resolves.toEqual({});

      expect(mockCacheGet).toHaveBeenCalledWith(mockCacheKey);
    });

    test("should call findByPk on ActivityEntity with id param and store result to cache when cache not exist", async () => {
      const mockId = 1;
      const mockCacheKey = `${baseCacheKey}-activity-${mockId}`;

      mockCacheGet.mockImplementation(() => undefined);

      await activityRepository.getActivity(mockId);

      expect(mockActivityEntity.findByPk).toHaveBeenCalledWith(mockId);
      expect(mockCacheSet).toHaveBeenCalledWith(mockCacheKey, undefined, {
        ttl: 60,
      });
    });
  });

  describe("updateActivity", () => {
    test("should call update on entity param and delete cache with given entity.id", async () => {
      const mockDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };
      const mockEntity = new ActivityEntity(mockDto);
      const mockCacheKey = `${baseCacheKey}-activity-${mockEntity.id}`;

      await activityRepository.updateActivity(mockEntity, mockDto);

      expect(mockEntity.update).toHaveBeenCalledWith(mockDto);
      expect(mockCacheDel).toHaveBeenCalledWith(mockCacheKey);
    });
  });

  describe("deleteActivity", () => {
    test("should call destroy on entity param and delete cache with given entity.id", async () => {
      const mockDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };
      const mockEntity = new ActivityEntity(mockDto);
      const mockCacheKey = `${baseCacheKey}-activity-${mockEntity.id}`;

      await activityRepository.deleteActivity(mockEntity);

      expect(mockEntity.destroy).toHaveBeenCalled();
      expect(mockCacheDel).toHaveBeenCalledWith(mockCacheKey);
    });
  });
});
