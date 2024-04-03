import { AddAccount } from "@src/domain/usecases/account/add-account";
import Authentication from "@src/domain/usecases/account/authentication";
import EmailAlreadyUsedError from "@src/presentation/errors/email-already-used-error";
import MissingParamError from "@src/presentation/errors/missing-param-error";
import {
  conflict,
  internalServerError,
  ok,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";
import Validation from "@src/presentation/protocols/validation";

export type RequestSignUpBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export type ResponseSignUpBody = {
  accessToken: string;
  name: string;
};

export default class SignUpController
  implements Controller<RequestSignUpBody, Error | ResponseSignUpBody>
{
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
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
      const account = await this.addAccount.add({ email, name, password });
      if (!account) {
        return conflict(new EmailAlreadyUsedError());
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const authResult = (await this.authentication.auth({ email, password }))!;
      return ok({ accessToken: authResult.accessToken, name: authResult.name });
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
