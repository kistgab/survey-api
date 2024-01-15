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
      return {
        statusCode: 422,
        body: new Error("Missing param: name"),
      };
    }
    if (!httpRequest.body?.email) {
      return {
        statusCode: 422,
        body: new Error("Missing param: email"),
      };
    }
    return {
      statusCode: 500,
      body: new Error("Unexpected error"),
    };
  }
}
