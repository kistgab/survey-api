import adaptMiddleware from "@src/main/adapters/express-middleware-adapter";
import AuthMiddlewareFactory from "@src/main/factories/middlewares/auth-middleware-factory";
import { NextFunction, Request, Response } from "express";

export function auth(): (req: Request, res: Response, next: NextFunction) => void {
  return adaptMiddleware(AuthMiddlewareFactory.create());
}
