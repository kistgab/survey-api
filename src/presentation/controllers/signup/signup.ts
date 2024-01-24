import { OutputAddAccountDto } from "../../../domain/dtos/add-account-dto";
import { AddAccount } from "../../../domain/usecases/add-account";
import MissingParamError from "../../errors/missing-param-error";
import { internalServerError, ok, unprocessableContent } from "../../helpers/http-helper";
import Validation from "../../helpers/validators/validation";
import Controller from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export type RequestSignUpBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default class SignUpController
  implements Controller<RequestSignUpBody, Error | OutputAddAccountDto>
{
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation<unknown>,
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
      const { email, password, name } = httpRequest.body;
      const account = await this.addAccount.add({ email, name, password });
      return ok(account);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
