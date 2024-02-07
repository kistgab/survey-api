export default class EmailAlreadyUsedError extends Error {
  constructor() {
    super(`The received e-mail address is already in use`);
    this.name = "EmailAlreadyUsedError";
  }
}
