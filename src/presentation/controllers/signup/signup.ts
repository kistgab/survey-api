import { AddAccount, OutputAddAccountDto } from "../../../domain/usecases/add-account";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import ServerError from "../../errors/server-error";
import { internalServerError, unprocessableContent } from "../../helpers/http-helper";
import Controller from "../../protocols/controller";
import EmailValidator from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type RequestBodyField = keyof RequestBody;

export default class SignUpController
  implements Controller<RequestBody, Error | OutputAddAccountDto>
{
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
  ) {}

  handle(httpRequest: HttpRequest<RequestBody>): HttpResponse<Error | OutputAddAccountDto> {
    try {
      if (!httpRequest.body) {
        return unprocessableContent(new MissingParamError("body"));
      }
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
      const { email, password, name, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return unprocessableContent(new InvalidParamError("passwordConfirmation"));
      }
      if (!this.emailValidator.isValid(email)) {
        return unprocessableContent(new InvalidParamError("email"));
      }
      const account = this.addAccount.add({ email, name, password });
      return {
        statusCode: 200,
        body: account,
      };
    } catch (error) {
      return internalServerError(new ServerError());
    }
  }
}
