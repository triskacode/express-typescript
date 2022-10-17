import { Controller as IController } from "./controller.type";

export interface Module<
  Controller = IController,
  Repository = {},
  Service = {}
> {
  controller?: Controller;
  repository?: Repository;
  service?: Service;
}

export interface OnAfterInitModule {
  onAfterInitModule(): void;
}
