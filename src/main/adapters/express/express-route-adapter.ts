import { Request, Response } from "express";
import Controller from "../../../presentation/protocols/controller";
import { HttpRequest } from "../../../presentation/protocols/http";

export default function adaptRoute<RequestBody, ResponseBody>(
  controller: Controller<RequestBody, ResponseBody>,
): (req: Request, res: Response) => void {
  async function adaptToExpress(req: Request, res: Response): Promise<void> {
    const httpRequest: HttpRequest<RequestBody> = {
      body: req.body as RequestBody,
    };
    const httpResponse = await controller.handle(httpRequest);
    const isSuccessStatusCode = httpResponse.statusCode >= 200 && httpResponse.statusCode < 300;
    if (!isSuccessStatusCode) {
      res.status(httpResponse.statusCode).json({ error: (httpResponse.body as Error).message });
      return;
    }
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return adaptToExpress;
}
