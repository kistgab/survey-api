import { NextFunction, Request, Response } from "express";
import adaptMiddleware from "../../adapters/express-middleware-adapter";
import AuthMiddlewareFactory from "../../factories/middlewares/auth-middleware-factory";

export function auth(): (req: Request, res: Response, next: NextFunction) => void {
  return adaptMiddleware(AuthMiddlewareFactory.create());
}
