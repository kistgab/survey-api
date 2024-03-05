import DbFindAccountByTokenFactory from "@src/main/factories/usecases/account/find-account-by-token/db-find-account-by-token-factory";
import { AuthMiddleware } from "@src/presentation/middlewares/auth/auth-middleware";
import Middleware from "@src/presentation/protocols/middleware";

export default abstract class AuthMiddlewareFactory {
  static create(role?: string): Middleware {
    return new AuthMiddleware(DbFindAccountByTokenFactory.create(), role);
  }
}
