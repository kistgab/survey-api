import MissingParamError from "../errors/missing-param-error";
import { internalServerError, unprocessableContent } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

type RequestBodyField = keyof RequestBody;

export default class SignUpController {
  handle(httpRequest: HttpRequest<RequestBody>): HttpResponse<Error> {
    const requiredFields: RequestBodyField[] = ["name", "email", "password"];
    for (const field of requiredFields) {
      if (!httpRequest.body?.[field]) {
        return unprocessableContent(new MissingParamError(field));
      }
    }
    return internalServerError(new Error("Unexpected error"));
  }
}
