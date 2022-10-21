import { Cache } from "cache-manager";
import { CreateTodoDto } from "./dto/create-todo.dto";
import { FilterGetTodosDto } from "./dto/filter-get-todos.dto";
import { UpdateTodoDto } from "./dto/update-todo.dto";
import { TodoEntity } from "./entities/todo.entity";

export class TodoRepository {
  private readonly baseCacheKey = "todo-repository";

  constructor(
    private readonly todoEntity: typeof TodoEntity,
    private readonly cacheService: Cache
  ) {}

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
    const cacheKey = `${this.baseCacheKey}-todo-${id}`;
    const cache = (await this.cacheService.get(cacheKey)) as TodoEntity;

    if (cache) return cache;

    const todo = await this.todoEntity.findByPk(id);

    this.cacheService.set(cacheKey, todo, { ttl: 60 });

    return todo;
  }

  async updateTodo(
    entity: TodoEntity,
    dto: UpdateTodoDto
  ): Promise<TodoEntity> {
    const cacheKey = `${this.baseCacheKey}-todo-${entity.id}`;
    const todo = await entity.update(dto);

    this.cacheService.del(cacheKey);
    return todo;
  }

  async deleteTodo(entity: TodoEntity): Promise<TodoEntity> {
    const cacheKey = `${this.baseCacheKey}-todo-${entity.id}`;
    await entity.destroy();

    this.cacheService.del(cacheKey);
    return entity;
  }
}
