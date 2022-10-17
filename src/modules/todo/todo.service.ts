import { NotFoundException } from "common/exceptions";
import { ActivityRepository } from "modules/activity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { FilterGetTodosDto } from "./dto/filter-get-todos.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoEntity } from "./entities/todo.entity";
import { TodoRepository } from "./todo.repository";

export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  async getTodos(filter?: FilterGetTodosDto): Promise<TodoEntity[]> {
    const todos = await this.todoRepository.getTodos(filter);

    return todos;
  }

  async getTodo(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.getTodo(id);

    if (!todo) throw new NotFoundException(`Todo with id: ${id} not found`);

    return todo;
  }

  async createTodo(dto: CreateTodoDto): Promise<TodoEntity> {
    const activity = await this.activityRepository.getActivity(
      dto.activity_group_id
    );

    if (!activity)
      throw new NotFoundException(
        `Activity group with id: ${dto.activity_group_id} not found`
      );

    const todo = await this.todoRepository.createTodo(dto);

    return todo;
  }

  async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoRepository.getTodo(id);

    if (!todo) throw new NotFoundException(`Todo with id: ${id} not found`);

    if (dto.activity_group_id) {
      const activity = await this.activityRepository.getActivity(
        dto.activity_group_id
      );

      if (!activity)
        throw new NotFoundException(
          `Activity group with id: ${dto.activity_group_id} not found`
        );
    }

    const updatedTodo = await this.todoRepository.updateTodo(todo, dto);

    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<TodoEntity> {
    const todo = await this.todoRepository.getTodo(id);

    if (!todo) throw new NotFoundException(`Todo with id: ${id} not found`);

    const deletedTodo = await this.todoRepository.deleteTodo(todo);

    return deletedTodo;
  }
}
