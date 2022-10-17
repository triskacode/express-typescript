import { AppRouter } from "app";
import { Request, Response } from "express";

export interface Controller {
  initializeRoute(router: typeof AppRouter): void;
}

export type ControllerMethod = (req: Request, res: Response) => any;
