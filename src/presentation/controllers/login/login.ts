import MissingParamError from "../../errors/missing-param-error";
import { unprocessableContent } from "../../helpers/http-helper";
import Controller from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export type RequestLoginBody = {
  email: string;
  password: string;
};

export default class LoginController implements Controller<RequestLoginBody, void | Error> {
  async handle(httpRequest: HttpRequest<RequestLoginBody>): Promise<HttpResponse<void | Error>> {
    if (!httpRequest.body?.email) {
      return unprocessableContent(new MissingParamError("email"));
    }
    if (!httpRequest.body?.password) {
      return unprocessableContent(new MissingParamError("password"));
    }
    await Promise.resolve();
    return unprocessableContent(new Error("error"));
  }
}
