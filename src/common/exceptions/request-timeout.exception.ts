import { HttpException } from "./http.exception";

export class RequestTimeoutException extends HttpException {
  constructor(message: string) {
    super(message);

    this.name = "RequestTimeoutException";
  }
}
