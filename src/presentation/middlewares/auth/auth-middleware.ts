import FindAccountByToken from "../../../domain/usecases/find-account-by-token";
import AccessDeniedError from "../../errors/access-denied-error";
import { forbidden, internalServerError, ok } from "../../helpers/http/http-helper";
import { HttpRequest, HttpResponse } from "../../protocols/http";
import Middleware from "../../protocols/middleware";

export class AuthMiddleware implements Middleware {
  constructor(
    private readonly findAccountByToken: FindAccountByToken,
    private readonly role?: string,
  ) {}

  async handle(httpRequest: HttpRequest<unknown>): Promise<HttpResponse<unknown>> {
    try {
      const accessToken = httpRequest.headers?.["x-access-token"] as string;
      if (!accessToken) {
        return forbidden(new AccessDeniedError());
      }
      const account = await this.findAccountByToken.findByToken(accessToken, this.role);
      if (account) {
        return ok({ accountId: account.id });
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
