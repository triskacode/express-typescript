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

    this.clearCache();

    return todo;
  }

  async getTodos(filter?: FilterGetTodosDto): Promise<TodoEntity[]> {
    const cacheKey = this.getCacheKey("get-todos", filter);
    const cache = (await this.cacheService.get(cacheKey)) as TodoEntity[];

    if (cache) return cache;

    const todos = await this.todoEntity.findAll({
      where: filter?.where,
      limit: filter?.take,
      offset: filter?.skip,
      order: filter?.orderBy,
    });

    this.cacheService.set(cacheKey, todos, { ttl: 60 });

    return todos;
  }

  async getTodo(id: number): Promise<TodoEntity | null> {
    const cacheKey = this.getCacheKey("get-todo", id.toString());
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
    const todo = await entity.update(dto);

    this.clearCache();

    return todo;
  }

  async deleteTodo(entity: TodoEntity): Promise<TodoEntity> {
    await entity.destroy();

    this.clearCache();

    return entity;
  }

  private getCacheKey(uniqueKey: string, keys?: string | Record<string, any>) {
    const keyStr = keys
      ? typeof keys === "string"
        ? `key=${keys}`
        : Object.keys(keys)
            .map((key) => `${key}=${keys[key]}`)
            .join(",")
      : "";

    return `${this.baseCacheKey}-${uniqueKey}${
      keyStr ? `?${keyStr.toLocaleLowerCase()}` : ""
    }`;
  }

  private async clearCache() {
    const keys = (await this.cacheService.store.keys?.()) as string[];
    const matchedKeys = await keys.filter((key) =>
      key.match(new RegExp(this.baseCacheKey, "g"))
    );

    if (matchedKeys.length > 0) {
      await matchedKeys.map(async (key) => {
        await this.cacheService.del(key);
      });
    }
  }
}
