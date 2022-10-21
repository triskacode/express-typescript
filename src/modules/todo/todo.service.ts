import { BadRequestException, NotFoundException } from "src/common/exceptions";
import { ActivityRepository } from "src/modules/activity";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { FilterGetTodosDto } from "./dto/filter-get-todos.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoEntity } from "./entities/todo.entity";
import { TodoRepository } from "./todo.repository";
import { createTodoValidation } from "./validation/create-todo.validation";
import { filterGetTodosValidation } from "./validation/filter-get-todos.validation";
import { getTodoValidation } from "./validation/get-todo.validation";
import { updateTodoValidation } from "./validation/update-todo.validation";

export class TodoService {
  constructor(
    private readonly todoRepository: TodoRepository,
    private readonly activityRepository: ActivityRepository
  ) {}

  async getTodos(filter?: FilterGetTodosDto): Promise<TodoEntity[]> {
    const { error: errorValidateFilter } =
      filterGetTodosValidation.validate(filter);

    if (errorValidateFilter) {
      throw new BadRequestException(errorValidateFilter.message);
    }

    const todos = await this.todoRepository.getTodos(filter);

    return todos;
  }

  async getTodo(id: number): Promise<TodoEntity> {
    const { error: errorValidateId } = getTodoValidation.validate(id);

    if (errorValidateId) {
      throw new BadRequestException(errorValidateId.message);
    }

    const todo = await this.todoRepository.getTodo(id);

    if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

    return todo;
  }

  async createTodo(dto: CreateTodoDto): Promise<TodoEntity> {
    const { error: errorValidateDto } = createTodoValidation.validate(dto);

    if (errorValidateDto) {
      throw new BadRequestException(errorValidateDto.message);
    }

    const activity = await this.activityRepository.getActivity(
      dto.activity_group_id
    );

    if (!activity)
      throw new NotFoundException(
        `Activity with ID ${dto.activity_group_id} Not Found`
      );

    const todo = await this.todoRepository.createTodo(dto);

    return todo;
  }

  async updateTodo(id: number, dto: UpdateTodoDto): Promise<TodoEntity> {
    const { error: errorValidateId } = getTodoValidation.validate(id);

    if (errorValidateId) {
      throw new BadRequestException(errorValidateId.message);
    }

    const { error: errorValidateDto } = updateTodoValidation.validate(dto);

    if (errorValidateDto) {
      throw new BadRequestException(errorValidateDto.message);
    }

    const todo = await this.todoRepository.getTodo(id);

    if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

    if (dto.activity_group_id) {
      const activity = await this.activityRepository.getActivity(
        dto.activity_group_id
      );

      if (!activity)
        throw new NotFoundException(
          `Activity with ID ${dto.activity_group_id} Not Found`
        );
    }

    const updatedTodo = await this.todoRepository.updateTodo(todo, dto);

    return updatedTodo;
  }

  async deleteTodo(id: number): Promise<TodoEntity> {
    const { error: errorValidateId } = getTodoValidation.validate(id);

    if (errorValidateId) {
      throw new BadRequestException(errorValidateId.message);
    }

    const todo = await this.todoRepository.getTodo(id);

    if (!todo) throw new NotFoundException(`Todo with ID ${id} Not Found`);

    const deletedTodo = await this.todoRepository.deleteTodo(todo);

    return deletedTodo;
  }
}
