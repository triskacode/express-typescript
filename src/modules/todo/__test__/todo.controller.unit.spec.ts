import { Request, Response } from "express";
import { Priority } from "../entities/types/todo.type";
import { TodoController } from "../todo.controller";
import { TodoService } from "../todo.service";

const mockGetTodos = jest.fn();
const mockGetTodo = jest.fn();
const mockCreateTodo = jest.fn();
const mockUpdateTodo = jest.fn();
const mockDeleteTodo = jest.fn();
const mockTodoService = jest.fn(
  () =>
    ({
      getTodos: mockGetTodos,
      getTodo: mockGetTodo,
      createTodo: mockCreateTodo,
      updateTodo: mockUpdateTodo,
      deleteTodo: mockDeleteTodo,
    } as unknown as TodoService)
);

describe("TodoController", () => {
  let todoController: TodoController;

  beforeEach(() => {
    const todoService = new mockTodoService();
    todoController = new TodoController(todoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTodos", () => {
    beforeEach(() => {
      mockGetTodos.mockImplementation((args) => []);
    });

    test("should call service with param filter limit 10 item by default", async () => {
      const fakeRequest = { query: {} } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await todoController.getTodos(fakeRequest, fakeResponse);

      expect(mockGetTodos).toHaveBeenCalledWith({ take: 10 });
    });

    test("should call service with param filter activity_group_id when adding activity_group_id field in request query", async () => {
      const fakeActivityGroupId = 1;
      const fakeRequest = {
        query: {
          activity_group_id: fakeActivityGroupId,
        },
      } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await todoController.getTodos(fakeRequest, fakeResponse);

      expect(mockGetTodos).toHaveBeenCalledWith({
        take: 10,
        where: { activity_group_id: fakeActivityGroupId },
      });
    });
  });

  describe("getTodo", () => {
    beforeEach(() => {
      mockGetTodo.mockImplementation((args) => ({}));
    });

    test("should call service with param id from request params", async () => {
      const fakeId = 1;
      const fakeRequest = { params: { id: fakeId } } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await todoController.getTodo(fakeRequest, fakeResponse);

      expect(mockGetTodo).toHaveBeenCalledWith(fakeId);
    });
  });

  describe("createTodo", () => {
    beforeEach(() => {
      mockCreateTodo.mockImplementation((args) => ({}));
    });

    test("should call service with param dto from request body", async () => {
      const fakeTitle = "testing title";
      const fakeActivityGroupId = 1;
      const fakeIsActive = true;
      const fakePriority = Priority.Normal;
      const fakeRequest = {
        body: {
          title: fakeTitle,
          activity_group_id: fakeActivityGroupId,
          is_active: fakeIsActive,
          priority: fakePriority,
        },
      } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await todoController.createTodo(fakeRequest, fakeResponse);

      expect(mockCreateTodo).toHaveBeenCalledWith({
        title: fakeTitle,
        activity_group_id: fakeActivityGroupId,
        is_active: fakeIsActive,
        priority: fakePriority,
      });
    });
  });

  describe("updateActivity", () => {
    beforeEach(() => {
      mockUpdateTodo.mockImplementation((args) => ({}));
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

      await todoController.updateTodo(fakeRequest, fakeResponse);

      expect(mockUpdateTodo).toHaveBeenCalledWith(fakeId, {
        title: fakeTitle,
      });
    });
  });

  describe("deleteActivity", () => {
    beforeEach(() => {
      mockDeleteTodo.mockImplementation((args) => ({}));
    });

    test("should call service with param id from request params", async () => {
      const fakeId = 1;
      const fakeRequest = { params: { id: fakeId } } as unknown as Request;
      const fakeResponse = {} as unknown as Response;

      await todoController.deleteTodo(fakeRequest, fakeResponse);

      expect(mockDeleteTodo).toHaveBeenCalledWith(fakeId);
    });
  });
});
