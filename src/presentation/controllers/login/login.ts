import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { unprocessableContent } from "../../helpers/http-helper";
import Controller from "../../protocols/controller";
import EmailValidator from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export type RequestLoginBody = {
  email: string;
  password: string;
};

export default class LoginController implements Controller<RequestLoginBody, void | Error> {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest<RequestLoginBody>): Promise<HttpResponse<void | Error>> {
    if (!httpRequest.body?.email) {
      return unprocessableContent(new MissingParamError("email"));
    }
    if (!httpRequest.body?.password) {
      return unprocessableContent(new MissingParamError("password"));
    }
    const isValidEmail = this.emailValidator.isValid(httpRequest.body.email);
    if (!isValidEmail) {
      return unprocessableContent(new InvalidParamError("email"));
    }

    await Promise.resolve();
    return unprocessableContent(new Error("error"));
  }
}
