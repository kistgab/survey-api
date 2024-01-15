import InvalidParamError from "../errors/invalid-param-error";
import MissingParamError from "../errors/missing-param-error";
import ServerError from "../errors/server-error";
import { internalServerError, unprocessableContent } from "../helpers/http-helper";
import Controller from "../protocols/controller";
import EmailValidator from "../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../protocols/http";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type RequestBodyField = keyof RequestBody;

export default class SignUpController implements Controller<RequestBody, Error> {
  constructor(private readonly emailValidator: EmailValidator) {}

  handle(httpRequest: HttpRequest<RequestBody>): HttpResponse<Error> {
    try {
      const requiredFields: RequestBodyField[] = [
        "name",
        "email",
        "password",
        "passwordConfirmation",
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return unprocessableContent(new MissingParamError(field));
        }
      }
      if (httpRequest.body?.password !== httpRequest.body?.passwordConfirmation) {
        return unprocessableContent(new InvalidParamError("passwordConfirmation"));
      }
      if (!this.emailValidator.isValid(httpRequest.body?.email ?? "")) {
        return unprocessableContent(new InvalidParamError("email"));
      }
      return internalServerError(new ServerError());
    } catch (error) {
      return internalServerError(new ServerError());
    }
  }
}
