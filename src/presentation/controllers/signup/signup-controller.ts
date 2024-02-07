import { AddAccount } from "../../../domain/usecases/add-account";
import Authentication from "../../../domain/usecases/authentication";
import MissingParamError from "../../errors/missing-param-error";
import { internalServerError, ok, unprocessableContent } from "../../helpers/http/http-helper";
import Controller from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import Validation from "../../protocols/validation";

export type RequestSignUpBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type ResponseSignUpBody = {
  accessToken: string;
};

export default class SignUpController
  implements Controller<RequestSignUpBody, Error | ResponseSignUpBody>
{
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation<unknown>,
    private readonly authentication: Authentication,
  ) {}

  async handle(
    httpRequest: HttpRequest<RequestSignUpBody>,
  ): Promise<HttpResponse<Error | ResponseSignUpBody>> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return unprocessableContent(validationError);
      }
      if (!httpRequest.body) {
        return unprocessableContent(new MissingParamError("body"));
      }
      const { email, password, name } = httpRequest.body;
      await this.addAccount.add({ email, name, password });
      const accessToken = await this.authentication.auth({ email, password });
      return ok({ accessToken: String(accessToken) });
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
