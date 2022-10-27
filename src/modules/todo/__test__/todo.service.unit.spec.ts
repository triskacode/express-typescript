import { ValidationError } from "joi";
import { BadRequestException, NotFoundException } from "src/common/exceptions";
import { ActivityRepository } from "src/modules/activity";
import { Priority } from "../entities/types/todo.type";
import { TodoRepository } from "../todo.repository";
import { TodoService } from "../todo.service";
import { createTodoValidation } from "../validation/create-todo.validation";
import { filterGetTodosValidation } from "../validation/filter-get-todos.validation";
import { getTodoValidation } from "../validation/get-todo.validation";
import { updateTodoValidation } from "../validation/update-todo.validation";

jest.mock("../validation/filter-get-todos.validation");
jest.mock("../validation/get-todo.validation");
jest.mock("../validation/create-todo.validation");
jest.mock("../validation/update-todo.validation");

const mockFilterGetTodosValidation = jest.mocked(filterGetTodosValidation);
const mockGetTodoValidation = jest.mocked(getTodoValidation);
const mockCreateTodoValidation = jest.mocked(createTodoValidation);
const mockUpdateTodoValidation = jest.mocked(updateTodoValidation);

const mockGetActivity = jest.fn();
const mockActivityRepository = jest.fn(
  () => ({ getActivity: mockGetActivity } as unknown as ActivityRepository)
);

const mockGetTodos = jest.fn();
const mockGetTodo = jest.fn();
const mockCreateTodo = jest.fn();
const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();
const mockTodoRepository = jest.fn(
  () =>
    ({
      getTodos: mockGetTodos,
      getTodo: mockGetTodo,
      createTodo: mockCreateTodo,
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo,
    } as unknown as TodoRepository)
);

describe("TodoService", () => {
  let todoService: TodoService;

  beforeEach(() => {
    const activityRepository = new mockActivityRepository();
    const todoRepository = new mockTodoRepository();
    todoService = new TodoService(todoRepository, activityRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    beforeEach(() => {
      mockGetTodos.mockImplementation((args) => []);
      mockFilterGetTodosValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given filter param", async () => {
      const fakeFilter = {
        take: 10,
        where: { activity_group_id: 1 },
      };

      await todoService.getTodos(fakeFilter);

      expect(mockFilterGetTodosValidation.validate).toHaveBeenCalledWith(
        fakeFilter
      );
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeFilter = {
        take: 10,
        where: { activity_group_id: 1 },
      };

      mockFilterGetTodosValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(todoService.getTodos(fakeFilter)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should call repository with param validated filter", async () => {
      const fakeFilter = {
        take: 10,
        where: { activity_group_id: 1 },
      };

      await expect(todoService.getTodos(fakeFilter)).resolves.toEqual([]);

      expect(mockGetTodos).toBeCalledWith(fakeFilter);
    });
  });

  describe("getTodo", () => {
    beforeEach(() => {
      mockGetTodo.mockImplementation((args) => ({}));
      mockGetTodoValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given id param", async () => {
      const fakeId = 1;

      await todoService.getTodo(fakeId);

      expect(mockGetTodoValidation.validate).toHaveBeenCalledWith(fakeId);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeId = 1;

      mockGetTodoValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(todoService.getTodo(fakeId)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should call repository with param validated id", async () => {
      const fakeId = 1;

      await expect(todoService.getTodo(fakeId)).resolves.toEqual({});

      expect(mockGetTodo).toBeCalledWith(fakeId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const fakeId = 1;

      mockGetTodo.mockReturnValue(undefined);

      await expect(todoService.getTodo(fakeId)).rejects.toThrow(
        new NotFoundException(`Todo with ID ${fakeId} Not Found`)
      );
    });
  });

  describe("createTodo", () => {
    beforeEach(() => {
      mockGetActivity.mockImplementation((args) => ({}));
      mockCreateTodo.mockImplementation((args) => ({}));
      mockCreateTodoValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given dto param", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
        is_active: true,
        priority: Priority.Normal,
      };

      await todoService.createTodo(fakeDto);

      expect(mockCreateTodoValidation.validate).toHaveBeenCalledWith(fakeDto);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
        is_active: true,
        priority: Priority.Normal,
      };

      mockCreateTodoValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(todoService.createTodo(fakeDto)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should validate given activity_group_id dto to activityRepository", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
        is_active: true,
        priority: Priority.Normal,
      };

      await todoService.createTodo(fakeDto);

      expect(mockGetActivity).toHaveBeenCalledWith(fakeDto.activity_group_id);
    });

    test("should throw NotFoundException when given activity_group_id dto not exist in activityRepository", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
        is_active: true,
        priority: Priority.Normal,
      };

      mockGetActivity.mockReturnValue(undefined);

      await expect(todoService.createTodo(fakeDto)).rejects.toThrow(
        new NotFoundException(
          `Activity with ID ${fakeDto.activity_group_id} Not Found`
        )
      );
    });

    test("should call repository with param validated dto", async () => {
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
        is_active: true,
        priority: Priority.Normal,
      };

      await expect(todoService.createTodo(fakeDto)).resolves.toEqual({});

      expect(mockCreateTodo).toBeCalledWith(fakeDto);
    });
  });

  describe("updateTodo", () => {
    beforeEach(() => {
      mockGetActivity.mockImplementation((args) => ({}));
      mockGetTodo.mockImplementation((args) => ({}));
      mockUpdateTodo.mockImplementation((args) => ({}));
      mockGetTodoValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
      mockUpdateTodoValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given id and dto param", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      await todoService.updateTodo(fakeId, fakeDto);

      expect(mockGetTodoValidation.validate).toHaveBeenCalledWith(fakeId);
      expect(mockUpdateTodoValidation.validate).toHaveBeenCalledWith(fakeDto);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      mockGetTodoValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });
      mockUpdateTodoValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(todoService.updateTodo(fakeId, fakeDto)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should validate given param id to todoRepository", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      await todoService.updateTodo(fakeId, fakeDto);

      expect(mockGetTodo).toBeCalledWith(fakeId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
      };

      mockGetTodo.mockReturnValue(undefined);

      await expect(todoService.updateTodo(fakeId, fakeDto)).rejects.toThrow(
        new NotFoundException(`Todo with ID ${fakeId} Not Found`)
      );
    });

    test("should validate if given activity_group_id in dto to activityRepository", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
      };

      await todoService.updateTodo(fakeId, fakeDto);

      expect(mockGetActivity).toBeCalledWith(fakeDto.activity_group_id);
    });

    test("should throw NotFoundException when given activity_group_id in dto not exist", async () => {
      const fakeId = 1;
      const fakeDto = {
        title: "testing title",
        activity_group_id: 1,
      };

      mockGetActivity.mockReturnValue(undefined);

      await expect(todoService.updateTodo(fakeId, fakeDto)).rejects.toThrow(
        new NotFoundException(`Activity with ID ${fakeId} Not Found`)
      );
    });

    test("should call updateTodo repository with param todoEntity and dto", async () => {
      const fakeId = 1;
      const fakeTodoEntity = {};
      const fakeDto = {
        title: "testing title",
      };

      await expect(todoService.updateTodo(fakeId, fakeDto)).resolves.toEqual(
        {}
      );

      expect(mockUpdateTodo).toBeCalledWith(fakeTodoEntity, fakeDto);
    });
  });

  describe("deleteTodo", () => {
    beforeEach(() => {
      mockGetTodo.mockImplementation((args) => ({}));
      mockDeleteTodo.mockImplementation((args) => ({}));
      mockGetTodoValidation.validate.mockImplementation((args) => ({
        error: undefined,
        value: args,
      }));
    });

    test("should validate given id param", async () => {
      const fakeId = 1;

      await todoService.deleteTodo(fakeId);

      expect(mockGetTodoValidation.validate).toHaveBeenCalledWith(fakeId);
    });

    test("should throw BadRequestException when validation produce error", async () => {
      const fakeErrorMessage = "Some Error Message";
      const fakeId = 1;

      mockGetTodoValidation.validate.mockReturnValue({
        error: new Error(fakeErrorMessage) as ValidationError,
        value: undefined,
      });

      await expect(todoService.deleteTodo(fakeId)).rejects.toThrow(
        new BadRequestException(fakeErrorMessage)
      );
    });

    test("should validate given param id to todoRepository", async () => {
      const fakeId = 1;

      await todoService.deleteTodo(fakeId);

      expect(mockGetTodo).toBeCalledWith(fakeId);
    });

    test("should throw NotFoundException when given param id not exist", async () => {
      const fakeId = 1;

      mockGetTodo.mockReturnValue(undefined);

      await expect(todoService.deleteTodo(fakeId)).rejects.toThrow(
        new NotFoundException(`Todo with ID ${fakeId} Not Found`)
      );
    });

    test("should call deleteTodo repository with param todoEntity", async () => {
      const fakeId = 1;
      const fakeTodoEntity = {};

      await expect(todoService.deleteTodo(fakeId)).resolves.toEqual({});

      expect(mockDeleteTodo).toBeCalledWith(fakeTodoEntity);
    });
  });
});
