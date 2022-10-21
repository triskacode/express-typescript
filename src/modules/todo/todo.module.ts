import { Cache } from "cache-manager";
import { Module, OnAfterInitModule } from "common/types";
import { DatabaseService } from "database";
import { ActivityRepository } from "modules/activity";
import { TodoEntity } from "./entities/todo.entity";
import { TodoController } from "./todo.controller";
import { TodoRepository } from "./todo.repository";
import { TodoService } from "./todo.service";

export class TodoModule implements Module, OnAfterInitModule {
  controller: TodoController;
  repository: TodoRepository;
  service: TodoService;

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
