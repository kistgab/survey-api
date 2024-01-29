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
    if (httpResponse.statusCode !== 200) {
      res.status(httpResponse.statusCode).json({ error: (httpResponse.body as Error).message });
      return;
    }
    res.status(httpResponse.statusCode).json(httpResponse.body);
  }
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  return adaptToExpress;
}
