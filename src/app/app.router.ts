import { wrapControllerMethod } from "common/middleware";
import { ControllerMethod, MiddlewareFunction } from "common/types";
import { Router } from "express";

export class AppRouter {
  static router = Router();

  static get(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.get(path, wrapControllerMethod(controller), ...middleware);
  }

  static post(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.post(
      path,
      wrapControllerMethod(controller),
      ...middleware
    );
  }

  static patch(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.patch(
      path,
      wrapControllerMethod(controller),
      ...middleware
    );
  }

  static put(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.put(path, wrapControllerMethod(controller), ...middleware);
  }

  static delete(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.delete(
      path,
      wrapControllerMethod(controller),
      ...middleware
    );
  }
}
