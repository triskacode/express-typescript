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
    const cacheService = new mockCacheService();
    activityRepository = new ActivityRepository(cacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createActivity", () => {
    test("should call create on ActivityEntity with dto param", async () => {
      const fakeDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };

      await activityRepository.createActivity(fakeDto);

      expect(mockActivityEntity.create).toHaveBeenCalledWith(fakeDto);
    });
  });

  describe("getActivities", () => {
    test("should call findAll on ActivityEntity with filter param", async () => {
      const fakeFilter = {
        take: 10,
        where: { email: "testing@mail.com" },
      };

      await activityRepository.getActivities(fakeFilter);

      expect(mockActivityEntity.findAll).toHaveBeenCalledWith({
        where: fakeFilter.where,
        limit: fakeFilter.take,
        offset: undefined,
        order: undefined,
      });
    });
  });

  describe("getActivity", () => {
    beforeEach(() => {
      mockCacheGet.mockImplementation((...args) => ({}));
      mockCacheSet.mockImplementation((...args) => ({}));
    });

    test("should check to cache if given param id is already exist, return it", async () => {
      const fakeId = 1;
      const fakeCacheKey = `${baseCacheKey}-activity-${fakeId}`;

      await expect(activityRepository.getActivity(fakeId)).resolves.toEqual({});

      expect(mockCacheGet).toHaveBeenCalledWith(fakeCacheKey);
    });

    test("should call findByPk on ActivityEntity with id param and store result to cache when cache not exist", async () => {
      const fakeId = 1;
      const fakeCacheKey = `${baseCacheKey}-activity-${fakeId}`;

      mockCacheGet.mockReturnValue(undefined);

      await activityRepository.getActivity(fakeId);

      expect(mockActivityEntity.findByPk).toHaveBeenCalledWith(fakeId);
      expect(mockCacheSet).toHaveBeenCalledWith(fakeCacheKey, undefined, {
        ttl: 60,
      });
    });
  });

  describe("updateActivity", () => {
    beforeEach(() => {
      mockCacheDel.mockImplementation((...args) => ({} as any));
    });
  
    test("should call update on entity param and delete cache with given entity.id", async () => {
      const fakeDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };
      const fakeEntity = new ActivityEntity(fakeDto);
      const fakeCacheKey = `${baseCacheKey}-activity-${fakeEntity.id}`;

      await activityRepository.updateActivity(fakeEntity, fakeDto);

      expect(fakeEntity.update).toHaveBeenCalledWith(fakeDto);
      expect(mockCacheDel).toHaveBeenCalledWith(fakeCacheKey);
    });
  });

  describe("deleteActivity", () => {
    beforeEach(() => {
      mockCacheDel.mockImplementation((...args) => ({} as any));
    });
  
    test("should call destroy on entity param and delete cache with given entity.id", async () => {
      const fakeDto = {
        email: "testing@gmail.com",
        title: "testing title",
      };
      const fakeEntity = new ActivityEntity(fakeDto);
      const fakeCacheKey = `${baseCacheKey}-activity-${fakeEntity.id}`;

      await activityRepository.deleteActivity(fakeEntity);

      expect(fakeEntity.destroy).toHaveBeenCalled();
      expect(mockCacheDel).toHaveBeenCalledWith(fakeCacheKey);
    });
  });
});
