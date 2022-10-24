import * as express from "express";
import { Application } from "src/application";
import { CreateActivityDto } from "src/modules/activity/dto/create-activity.dto";
import { UpdateActivityDto } from "src/modules/activity/dto/update-activity.dto";
import { ActivityEntity } from "src/modules/activity/entities/activity.entity";
import request from "supertest";

describe("Activity", () => {
  let app: express.Application;
  let createActivityDto: CreateActivityDto;

  beforeAll(async () => {
    const applicationModule = new Application();
    app = await applicationModule.init();
  });

  beforeEach(async () => {
    await ActivityEntity.destroy({ where: {} });

    createActivityDto = {
      email: "testing@mail.com",
      title: "testing",
    };
  });

  describe("GET /activity-groups", () => {
    test("should return 200 with list of activity", async () => {
      const activities = await ActivityEntity.bulkCreate([
        createActivityDto,
        createActivityDto,
      ]);
      const response = await request(app).get("/activity-groups");

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContainEqual(
        expect.objectContaining(createActivityDto)
      );
    });
  });

  describe("GET /activity-groups/:id", () => {
    test("should return 200 with detail activity of given param id", async () => {
      const activity = await ActivityEntity.create(createActivityDto);
      const response = await request(app).get(
        `/activity-groups/${activity.id}`
      );

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining(createActivityDto)
      );
    });

    test("should return 404 if given param id not found", async () => {
      const sampleNotfoundActivityId = 0;
      const response = await request(app).get(
        `/activity-groups/${sampleNotfoundActivityId}`
      );

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${sampleNotfoundActivityId} Not Found`
      );
    });
  });

  describe("POST /activity-groups", () => {
    test("should return 201 with detail activity", async () => {
      const response = await request(app)
        .post("/activity-groups")
        .send(createActivityDto);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining(createActivityDto)
      );
    });

    test("should return 400 if given body not valid", async () => {
      const response = await request(app).post("/activity-groups").send({});

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual("Bad Request");
      expect(response.body.message).toMatch(
        /Parameter \'(email|title)\' is required/
      );
    });
  });

  describe("PATCH /activity-groups/:id", () => {
    test("should return 200 with detail activity", async () => {
      const activity = await ActivityEntity.create(createActivityDto);
      const updateActivityDto: UpdateActivityDto = { title: "updated" };
      const response = await request(app)
        .patch(`/activity-groups/${activity.id}`)
        .send(updateActivityDto);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining({ ...createActivityDto, ...updateActivityDto })
      );
    });

    test("should return 404 if given param id not found", async () => {
      const sampleNotfoundActivityId = 0;
      const response = await request(app)
        .patch(`/activity-groups/${sampleNotfoundActivityId}`)
        .send(createActivityDto);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${sampleNotfoundActivityId} Not Found`
      );
    });
  });

  describe("DELETE /activity-groups/:id", () => {
    test("should return 200 with empty object", async () => {
      const activity = await ActivityEntity.create(createActivityDto);
      const response = await request(app).delete(
        `/activity-groups/${activity.id}`
      );

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual({});
    });

    test("should return 404 if given param id not found", async () => {
      const sampleNotfoundActivityId = 0;
      const response = await request(app).delete(
        `/activity-groups/${sampleNotfoundActivityId}`
      );

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${sampleNotfoundActivityId} Not Found`
      );
    });
  });
});
