export default class ServerError extends Error {
  constructor() {
    super(`An unexpected error has occurred`);
    this.name = "ServerError";
  }
}
