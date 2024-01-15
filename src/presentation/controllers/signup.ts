import MissingParamError from "../errors/missing-param-error";
import { internalServerError, unprocessableContent } from "../helpers/http-helper";
import Controller from "../protocols/controller";
import { HttpRequest, HttpResponse } from "../protocols/http";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type RequestBodyField = keyof RequestBody;

export default class SignUpController implements Controller<RequestBody, Error> {
  handle(httpRequest: HttpRequest<RequestBody>): HttpResponse<Error> {
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
    return internalServerError(new Error("Unexpected error"));
  }
}
