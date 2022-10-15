import { Router } from "express";

export interface IController {
  initializeRoute(router: Router): Router;
}
