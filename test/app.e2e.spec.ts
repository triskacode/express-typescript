import { Application } from "src/application";
import * as express from "express";
import request from "supertest";

describe("Application", () => {
  let app: express.Application;

  beforeAll(async () => {
    const applicationModule = new Application();
    app = await applicationModule.init();
  });

  describe("GET /health-check", () => {
    test("should return 200 with OK", async () => {
      const response = await request(app).get("/health-check");

      expect(response.status).toEqual(200);
      expect(response.text).toEqual("OK");
    });
  });
});
