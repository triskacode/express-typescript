import { AppRouter } from "app";
import { Controller } from "common/types";
import { Request, Response } from "express";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { FilterGetTodosDto } from "./dto/filter-get-todos.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoAttributes } from "./entities/types/todo.type";
import { TodoService } from "./todo.service";

export class TodoController implements Controller {
  private readonly baseRoutePath = "/todo-items";

  constructor(private readonly todoService: TodoService) {}

  initializeRoute(router: typeof AppRouter): void {
    router.get(this.baseRoutePath, this.getTodos.bind(this));
    router.post(this.baseRoutePath, this.createTodo.bind(this));
    router.get(this.baseRoutePath + "/:id", this.getTodo.bind(this));
    router.patch(this.baseRoutePath + "/:id", this.updateTodo.bind(this));
    router.delete(this.baseRoutePath + "/:id", this.deleteTodo.bind(this));
  }

  private async getTodos(
    req: Request,
    res: Response
  ): Promise<TodoAttributes[]> {
    const activity_group_id = req.query.activity_group_id as string;
    const filter: FilterGetTodosDto = {
      take: 10,
      ...(activity_group_id ? { where: { activity_group_id } } : {}),
    };

    return this.todoService.getTodos(filter);
  }

  private async getTodo(req: Request, res: Response): Promise<TodoAttributes> {
    const id = req.params.id;

    return this.todoService.getTodo(+id);
  }

  private async createTodo(
    req: Request,
    res: Response
  ): Promise<TodoAttributes> {
    const dto: CreateTodoDto = {
      title: req.body.title,
      activity_group_id: req.body.activity_group_id,
      is_active: req.body.is_active,
      priority: req.body.priority,
    };

    return this.todoService.createTodo(dto);
  }

  private async updateTodo(
    req: Request,
    res: Response
  ): Promise<TodoAttributes> {
    const id = req.params.id;

    const dto: UpdateTodoDto = {
      ...(req.body.title !== undefined ? { title: req.body.title } : {}),
      ...(req.body.activity_group_id !== undefined
        ? { activity_group_id: req.body.activity_group_id }
        : {}),
      ...(req.body.is_active !== undefined
        ? { is_active: req.body.is_active }
        : {}),
      ...(req.body.priority !== undefined
        ? { priority: req.body.priority }
        : {}),
    };

    return this.todoService.updateTodo(+id, dto);
  }

  // private deleteTodo(req: Request, res: Response): Promise<TodoAttributes> {
  private async deleteTodo(req: Request, res: Response): Promise<{}> {
    const id = req.params.id;

    // return this.todoService.deleteTodo(+id);
    await this.todoService.deleteTodo(+id);
    return {};
  }
}
