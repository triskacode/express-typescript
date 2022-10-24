import * as express from "express";
import { Application } from "src/application";
import { ActivityEntity } from "src/modules/activity/entities/activity.entity";
import { CreateTodoDto } from "src/modules/todo/dto/create-todo.dto";
import { UpdateTodoDto } from "src/modules/todo/dto/update-todo.dto";
import { TodoEntity } from "src/modules/todo/entities/todo.entity";
import request from "supertest";

describe("Todo", () => {
  let app: express.Application;
  let activity: ActivityEntity;
  let createTodoDto: CreateTodoDto;

  beforeAll(async () => {
    const appModuleRef = new Application();
    app = await appModuleRef.init();
  });

  beforeEach(async () => {
    await ActivityEntity.destroy({ where: {} });
    await TodoEntity.destroy({ where: {} });

    activity = await ActivityEntity.create({
      email: "testing@mail.com",
      title: "testing",
    });

    createTodoDto = {
      activity_group_id: activity.id,
      title: "testing todo",
    };
  });

  describe("GET /todo-items", () => {
    test("should return 200 with list of todo", async () => {
      const todos = await TodoEntity.bulkCreate([createTodoDto, createTodoDto]);
      const response = await request(app).get("/todo-items");

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContainEqual(
        expect.objectContaining(createTodoDto)
      );
    });

    test("should return 200 with list of todo where given activity_group_id match", async () => {
      const todos = await TodoEntity.bulkCreate([createTodoDto, createTodoDto]);
      const response = await request(app)
        .get("/todo-items")
        .query({ activity_group_id: activity.id });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContainEqual(
        expect.objectContaining(createTodoDto)
      );
    });

    test("should return 200 with empty list of todo where given activity_group_id not match", async () => {
      const sampleNotfoundActivityId = 0;
      const todos = await TodoEntity.bulkCreate([createTodoDto, createTodoDto]);
      const response = await request(app)
        .get("/todo-items")
        .query({ activity_group_id: sampleNotfoundActivityId });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toHaveLength(0);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("GET /todo-items/:id", () => {
    test("should return 200 with detail activity of given param id", async () => {
      const todo = await TodoEntity.create(createTodoDto);
      const response = await request(app).get(`/todo-items/${todo.id}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining(createTodoDto)
      );
    });

    test("should return 404 if given param id not found", async () => {
      const sampleNotfoundTodoId = 0;
      const response = await request(app).get(
        `/todo-items/${sampleNotfoundTodoId}`
      );

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Todo with ID ${sampleNotfoundTodoId} Not Found`
      );
    });
  });

  describe("POST /todo-items", () => {
    test("should return 201 with detail todo", async () => {
      const response = await request(app)
        .post("/todo-items")
        .send(createTodoDto);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining(createTodoDto)
      );
    });

    test("should return 400 if given body not valid", async () => {
      const response = await request(app).post("/todo-items").send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual("Bad Request");
      expect(response.body.message).toMatch(
        /Parameter \'(activity_group_id|title)\' is required/
      );
    });

    test("should return 404 if given activity_group_id not found", async () => {
      const sampleNotfoundActivityId = 0;
      const response = await request(app)
        .post("/todo-items")
        .send({
          ...createTodoDto,
          activity_group_id: sampleNotfoundActivityId,
        });

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${sampleNotfoundActivityId} Not Found`
      );
    });
  });

  describe("PATCH /todo-items/:id", () => {
    test("should return 200 with detail activity", async () => {
      const todo = await TodoEntity.create(createTodoDto);
      const updateTodoDto: UpdateTodoDto = {
        title: "updated",
        is_active: false,
      };
      const response = await request(app)
        .patch(`/todo-items/${todo.id}`)
        .send(updateTodoDto);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining({ ...createTodoDto, ...updateTodoDto })
      );
    });

    test("should return 404 if given param id not found", async () => {
      const sampleNotfoundTodoId = 0;
      const response = await request(app)
        .patch(`/todo-items/${sampleNotfoundTodoId}`)
        .send(createTodoDto);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Todo with ID ${sampleNotfoundTodoId} Not Found`
      );
    });
  });

  describe("DELETE /todo-items/:id", () => {
    test("should return 200 with empty object", async () => {
      const todo = await TodoEntity.create(createTodoDto);
      const response = await request(app).delete(`/todo-items/${todo.id}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual({});
    });

    test("should return 404 if given param id not found", async () => {
      const sampleNotfoundTodoId = 0;
      const response = await request(app).delete(
        `/todo-items/${sampleNotfoundTodoId}`
      );

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Todo with ID ${sampleNotfoundTodoId} Not Found`
      );
    });
  });
});
