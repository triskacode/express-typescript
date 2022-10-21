import * as express from "express";
import { Application } from "src/application";
import { CreateActivityDto } from "src/modules/activity/dto/create-activity.dto";
import { ActivityEntity } from "src/modules/activity/entities/activity.entity";
import request from "supertest";

describe("Activity", () => {
  let app: express.Application;
  const activityDto: CreateActivityDto = {
    email: "testing@mail.com",
    title: "testing",
  };

  beforeAll(async () => {
    const applicationModule = new Application();
    app = await applicationModule.init();
  });

  beforeEach(async () => {
    await ActivityEntity.destroy({ where: {} });
  });

  describe("GET /activity-groups", () => {
    test("should return 200 with list of activity", async () => {
      const activities = await ActivityEntity.bulkCreate([
        activityDto,
        activityDto,
      ]);
      const response = await request(app).get("/activity-groups");

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toContainEqual(
        expect.objectContaining(activityDto)
      );
    });
  });

  describe("GET /activity-groups/:id", () => {
    test("should return 200 with detail activity of given param id", async () => {
      const activity = await ActivityEntity.create(activityDto);
      const response = await request(app).get(
        `/activity-groups/${activity.id}`
      );

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(expect.objectContaining(activityDto));
    });

    test("should return 404 if given param id not found", async () => {
      const activityId = 0;
      const response = await request(app).get(`/activity-groups/${activityId}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${activityId} Not Found`
      );
    });
  });

  describe("POST /activity-groups", () => {
    test("should return 201 with detail activity", async () => {
      const response = await request(app)
        .post("/activity-groups")
        .send(activityDto);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(expect.objectContaining(activityDto));
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
      const activity = await ActivityEntity.create(activityDto);
      const response = await request(app)
        .patch(`/activity-groups/${activity.id}`)
        .send({ title: "updated" });

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual(
        expect.objectContaining({ ...activityDto, title: "updated" })
      );
    });

    test("should return 404 if given param id not found", async () => {
      const activityId = 0;
      const response = await request(app)
        .patch(`/activity-groups/${activityId}`)
        .send(activityDto);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${activityId} Not Found`
      );
    });
  });

  describe("DELETE /activity-groups/:id", () => {
    test("should return 200 with empty object", async () => {
      const activity = await ActivityEntity.create(activityDto);
      const response = await request(app).delete(
        `/activity-groups/${activity.id}`
      );

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual("Success");
      expect(response.body.data).toEqual({});
    });

    test("should return 404 if given param id not found", async () => {
      const activityId = 0;
      const response = await request(app).delete(
        `/activity-groups/${activityId}`
      );

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual("Not Found");
      expect(response.body.message).toEqual(
        `Activity with ID ${activityId} Not Found`
      );
    });
  });
});
