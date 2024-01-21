export default class ServerError extends Error {
  constructor(stack: string) {
    super(`An unexpected error has occurred`);
    this.name = "ServerError";
    this.stack = stack;
  }
}
