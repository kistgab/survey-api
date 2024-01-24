import Authentication from "../../../domain/usecases/authentication";
import MissingParamError from "../../errors/missing-param-error";
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableContent,
} from "../../helpers/http/http-helper";
import Validation from "../../helpers/validators/validation";
import Controller from "../../protocols/controller";
import EmailValidator from "../../protocols/email-validator";
import { HttpRequest, HttpResponse } from "../../protocols/http";

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
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
    private readonly validation: Validation<unknown>,
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
      const accessToken = await this.authentication.auth(email, password);
      if (!accessToken) {
        return unauthorized();
      }
      return ok({ accessToken });
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
