import { ControllerMethod, MiddlewareFunction } from "common/types";
import { Router } from "express";
import { wrapControllerMethodMiddleware } from "./middleware/wrap-controller-method.middleware";

export class AppRouter {
  static router = Router();

  static get(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.get(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  static post(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.post(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  static patch(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.patch(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  static put(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.put(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  static delete(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ) {
    AppRouter.router.delete(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }
}
