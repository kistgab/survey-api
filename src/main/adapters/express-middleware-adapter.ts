import { NextFunction, Request, Response } from "express";
import { HttpRequest } from "../../presentation/protocols/http";
import Middleware from "../../presentation/protocols/middleware";

export default function adaptMiddleware(
  middleware: Middleware,
): (req: Request, res: Response, next: NextFunction) => void {
  async function adaptToExpress(req: Request, res: Response, next: NextFunction): Promise<void> {
    const httpRequest: HttpRequest = {
      headers: req.headers,
    };
    const httpResponse = await middleware.handle(httpRequest);
    if (httpResponse.statusCode === 200) {
      Object.assign(req, httpResponse.body);
      next();
      return;
    }
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return adaptToExpress;
}
