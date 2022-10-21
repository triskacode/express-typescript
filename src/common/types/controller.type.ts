import { AppRouter } from "src/app";
import { Request, Response } from "express";

export interface Controller {
  initializeRoute(router: AppRouter): void;
}

export type ControllerMethod = (req: Request, res: Response) => any;
