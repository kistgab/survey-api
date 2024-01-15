import MissingParamError from "../errors/missing-param-error";
import { internalServerError, unprocessableContent } from "../helpers/http-helper";
import { HttpRequest, HttpResponse } from "../protocols/http";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default class SignUpController {
  handle(httpRequest: HttpRequest<RequestBody>): HttpResponse<Error> {
    if (!httpRequest.body?.name) {
      return unprocessableContent(new MissingParamError("name"));
    }
    if (!httpRequest.body?.email) {
      return unprocessableContent(new MissingParamError("email"));
    }
    return internalServerError(new Error("Unexpected error"));
  }
}
