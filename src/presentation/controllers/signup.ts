import MissingParamError from "../errors/missing-param-error";
import { HttpRequest, HttpResponse } from "../protocols/http";

type RequestBody = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

export default class SignUpController {
  handle(httpRequest: HttpRequest<RequestBody>): HttpResponse<MissingParamError> {
    if (!httpRequest.body?.name) {
      return {
        statusCode: 422,
        body: new MissingParamError("name"),
      };
    }
    if (!httpRequest.body?.email) {
      return {
        statusCode: 422,
        body: new MissingParamError("email"),
      };
    }
    return {
      statusCode: 500,
      body: new MissingParamError("Unexpected error"),
    };
  }
}
