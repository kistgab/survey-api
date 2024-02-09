import FindAccountByTokenRepository from "../../../data/protocols/db/account/find-account-by-token-repository";
import AccessDeniedError from "../../errors/access-denied-error";
import { forbidden } from "../../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import Middleware from "../../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(private readonly findAccountByTokenRepository: FindAccountByTokenRepository) {}

  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>> {
    const accessToken = httpRequest.headers?.["x-access-token"] as string;
    if (!accessToken) {
      return forbidden(new AccessDeniedError());
    }
    await this.findAccountByTokenRepository.findByToken(accessToken);
    return forbidden(new AccessDeniedError());
  }
}
