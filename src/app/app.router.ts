import { Router } from "express";
import { ControllerMethod, MiddlewareFunction } from "src/common/types";
import { wrapControllerMethodMiddleware } from "./middleware/wrap-controller-method.middleware";

export class AppRouter {
  private _router: Router;

  constructor() {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  get(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ): void {
    this._router.get(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  post(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ): void {
    this._router.post(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  patch(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ): void {
    this._router.patch(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  put(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ): void {
    this._router.put(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }

  delete(
    path: string,
    controller: ControllerMethod,
    ...middleware: MiddlewareFunction[]
  ): void {
    this._router.delete(
      path,
      ...[...middleware, wrapControllerMethodMiddleware(controller)]
    );
  }
}
