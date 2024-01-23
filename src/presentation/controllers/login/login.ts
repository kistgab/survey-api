import Authentication from "../../../domain/usecases/authentication";
import InvalidParamError from "../../errors/invalid-param-error";
import MissingParamError from "../../errors/missing-param-error";
import {
  internalServerError,
  ok,
  unauthorized,
  unprocessableContent,
} from "../../helpers/http-helper";
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

type RequestBodyField = keyof RequestLoginBody;

export default class LoginController
  implements Controller<RequestLoginBody, ResponseLoginBody | Error>
{
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication,
  ) {}

  async handle(
    httpRequest: HttpRequest<RequestLoginBody>,
  ): Promise<HttpResponse<ResponseLoginBody | Error>> {
    try {
      if (!httpRequest.body) {
        return unprocessableContent(new MissingParamError("body"));
      }
      const requiredFields: RequestBodyField[] = ["email", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return unprocessableContent(new MissingParamError(field));
        }
      }
      const { email, password } = httpRequest.body;
      const isValidEmail = this.emailValidator.isValid(email);
      if (!isValidEmail) {
        return unprocessableContent(new InvalidParamError("email"));
      }
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
