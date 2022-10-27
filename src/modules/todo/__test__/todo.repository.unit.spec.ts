import { Cache } from "cache-manager";
import { TodoEntity } from "../entities/todo.entity";
import { Priority } from "../entities/types/todo.type";
import { TodoRepository } from "../todo.repository";

jest.mock("../entities/todo.entity");

const mockTodoEntity = jest.mocked(TodoEntity);

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

describe("TodoRepository", () => {
  const baseCacheKey = "todo-repository";
  let todoRepository: TodoRepository;

  beforeEach(() => {
    const cacheService = new mockCacheService();
    todoRepository = new TodoRepository(cacheService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTodo", () => {
    test("should call create on TodoEntity with dto param", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
        is_active: true,
        priority: Priority.Normal,
      };

      await todoRepository.createTodo(fakeDto);

      expect(mockTodoEntity.create).toHaveBeenCalledWith(fakeDto);
    });
  });

  describe("getTodos", () => {
    test("should call findAll on TodoEntity with filter param", async () => {
      const fakeFilter = {
        take: 10,
        where: { activity_group_id: 1 },
      };

      await todoRepository.getTodos(fakeFilter);

      expect(mockTodoEntity.findAll).toHaveBeenCalledWith({
        where: fakeFilter.where,
        limit: fakeFilter.take,
        offset: undefined,
        order: undefined,
      });
    });
  });

  describe("getTodo", () => {
    beforeEach(() => {
      mockCacheGet.mockImplementation((...args) => ({}));
      mockCacheSet.mockImplementation((...args) => ({}));
    });

    test("should check to cache if given param id is already exist, return it", async () => {
      const fakeId = 1;
      const fakeCacheKey = `${baseCacheKey}-todo-${fakeId}`;

      await expect(todoRepository.getTodo(fakeId)).resolves.toEqual({});

      expect(mockCacheGet).toHaveBeenCalledWith(fakeCacheKey);
    });

    test("should call findByPk on TodoEntity with id param and store result to cache when cache not exist", async () => {
      const fakeId = 1;
      const fakeCacheKey = `${baseCacheKey}-todo-${fakeId}`;

      mockCacheGet.mockReturnValue(undefined);

      await todoRepository.getTodo(fakeId);

      expect(mockTodoEntity.findByPk).toHaveBeenCalledWith(fakeId);
      expect(mockCacheSet).toHaveBeenCalledWith(fakeCacheKey, undefined, {
        ttl: 60,
      });
    });
  });

  describe("updateTodo", () => {
    beforeEach(() => {
      mockCacheDel.mockImplementation((...args) => ({} as any));
    });

    test("should call update on entity param and delete cache with given entity.id", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
      };
      const fakeEntity = new TodoEntity(fakeDto);
      const fakeCacheKey = `${baseCacheKey}-todo-${fakeEntity.id}`;

      await todoRepository.updateTodo(fakeEntity, fakeDto);

      expect(fakeEntity.update).toHaveBeenCalledWith(fakeDto);
      expect(mockCacheDel).toHaveBeenCalledWith(fakeCacheKey);
    });
  });

  describe("deleteTodo", () => {
    beforeEach(() => {
      mockCacheDel.mockImplementation((...args) => ({} as any));
    });

    test("should call destroy on entity param and delete cache with given entity.id", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
      };
      const fakeEntity = new TodoEntity(fakeDto);
      const fakeCacheKey = `${baseCacheKey}-todo-${fakeEntity.id}`;

      await todoRepository.deleteTodo(fakeEntity);

      expect(fakeEntity.destroy).toHaveBeenCalled();
      expect(mockCacheDel).toHaveBeenCalledWith(fakeCacheKey);
    });
  });
});
