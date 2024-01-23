import { OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import { internalServerError, ok, unprocessableContent } from "../../helpers/http-helper";
import Controller from "../../protocols/controller";
import EmailValidator from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import Validation from "../../protocols/validation";

export type RequestSignUpBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type RequestBodyField = keyof RequestSignUpBody;

export default class SignUpController
  implements Controller<RequestSignUpBody, Error | OutputAddAccountDto>
{
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}

  async handle(
    httpRequest: HttpRequest<RequestSignUpBody>,
  ): Promise<HttpResponse<Error | OutputAddAccountDto>> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return unprocessableContent(validationError);
      }
      if (!httpRequest.body) {
        return unprocessableContent(new MissingParamError("body"));
      }
      const { email, password, name, passwordConfirmation } = httpRequest.body;
      if (password !== passwordConfirmation) {
        return unprocessableContent(new InvalidParamError("passwordConfirmation"));
      }
      if (!this.emailValidator.isValid(email)) {
        return unprocessableContent(new InvalidParamError("email"));
      }
      const account = await this.addAccount.add({ email, name, password });
      return ok(account);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
