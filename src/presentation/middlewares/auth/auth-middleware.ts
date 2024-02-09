import AccessDeniedError from "../../errors/access-denied-error";
import { forbidden } from "../../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import Middleware from "../../protocols/middleware";

export class AuthMiddleware implements Middleware {
  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>> {
    httpRequest;
    return Promise.resolve(forbidden(new AccessDeniedError()));
  }
}
