import FindAccountByTokenRepository from "../../../data/protocols/db/account/find-account-by-token-repository";
import AccessDeniedError from "../../errors/access-denied-error";
import { forbidden } from "../../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import Middleware from "../../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(private readonly findAccountByTokenRepository: FindAccountByTokenRepository) {}

  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>> {
    await this.findAccountByTokenRepository.findByToken(
      httpRequest.headers?.["x-access-token"] as string,
    );

    return forbidden(new AccessDeniedError());
  }
}
