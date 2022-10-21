import { Application } from "../src/application";
import * as express from "express";
import request from "supertest";

describe("App", () => {
  let app: express.Application;

  beforeAll(async () => {
    app = await new Application().init();
  });

  describe("GET /health-check", () => {
    test("should return 200 with OK", (done) => {
      request(app).get("/health-check").expect(200).expect("OK", done);
    });
  });
});
