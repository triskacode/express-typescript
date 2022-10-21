import { Cache } from "cache-manager";
import { Module, OnAfterInitModule } from "src/common/types";
import { DatabaseService } from "src/database";
import { ActivityRepository } from "src/modules/activity";
import { TodoEntity } from "./entities/todo.entity";
import { TodoController } from "./todo.controller";
import { TodoRepository } from "./todo.repository";
import { TodoService } from "./todo.service";

export class TodoModule implements Module, OnAfterInitModule {
  readonly controller: TodoController;
  readonly repository: TodoRepository;
  readonly service: TodoService;

  constructor(
    databaseService: DatabaseService,
    cacheService: Cache,
    activityRepository: ActivityRepository
  ) {
    databaseService.loadEntity(TodoEntity);

    this.repository = new TodoRepository(cacheService);
    this.service = new TodoService(this.repository, activityRepository);
    this.controller = new TodoController(this.service);
  }

  onAfterInitModule(): void {
    TodoEntity.loadRelation();
  }
}
