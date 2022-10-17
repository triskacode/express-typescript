import { CreateTodoDto } from "./dto/create-todo.dto";
import { FilterGetTodosDto } from "./dto/filter-get-todos.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoEntity } from "./entities/todo.entity";

export class TodoRepository {
  constructor(private readonly todoEntity: typeof TodoEntity) {}

  async createTodo(dto: CreateTodoDto): Promise<TodoEntity> {
    const todo = await this.todoEntity.create(dto);

    return todo;
  }

  async getTodos(filter?: FilterGetTodosDto): Promise<TodoEntity[]> {
    const todos = await this.todoEntity.findAll({
      where: filter?.where,
      limit: filter?.take,
      offset: filter?.skip,
      order: filter?.orderBy,
    });

    return todos;
  }

  async getTodo(id: number): Promise<TodoEntity | null> {
    const todo = await this.todoEntity.findByPk(id);

    return todo;
  }

  async updateTodo(
    entity: TodoEntity,
    dto: UpdateTodoDto
  ): Promise<TodoEntity> {
    const todo = await entity.update(dto);

    return todo;
  }

  async deleteTodo(entity: TodoEntity): Promise<TodoEntity> {
    await entity.destroy();

    return entity;
  }
}
