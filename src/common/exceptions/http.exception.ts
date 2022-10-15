export class HttpException extends Error {
  constructor(message: string) {
    super(message);

    this.name = "HttpException";
  }
}
