import { HttpException } from "./http.exception";

export class ServiceUnavailableException extends HttpException {
  constructor(message: string) {
    super(message);

    this.name = "ServiceUnavailableException";
  }
}
