import Authentication from "@src/domain/usecases/authentication";
import MissingParamError from "@src/presentation/errors/missing-param-error";
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";
import Validation from "@src/presentation/protocols/validation";

export type RequestLoginBody = {
  email: string;
  password: string;
};

export type ResponseLoginBody = {
  accessToken: string;
};

export default class LoginController
  implements Controller<RequestLoginBody, ResponseLoginBody | Error>
{
  constructor(
    private readonly authentication: Authentication,
    private readonly validation: Validation,
  ) {}

  async handle(
    httpRequest: HttpRequest<RequestLoginBody>,
  ): Promise<HttpResponse<ResponseLoginBody | Error>> {
    try {
      const validationError = this.validation.validate(httpRequest.body);
      if (validationError) {
        return unprocessableContent(validationError);
      }
      if (!httpRequest.body) {
        return unprocessableContent(new MissingParamError("body"));
      }
      const { email, password } = httpRequest.body;
      const accessToken = await this.authentication.auth({ email, password });
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
