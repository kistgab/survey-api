import { AuthMiddleware } from "../../../presentation/middlewares/auth/auth-middleware";
import Middleware from "../../../presentation/protocols/middleware";
import DbFindAccountByTokenFactory from "../usecases/find-account-by-token/db-find-account-by-token-factory";

export default abstract class AuthMiddlewareFactory {
  static create(role?: string): Middleware {
    return new AuthMiddleware(DbFindAccountByTokenFactory.create(), role);
  }
}
