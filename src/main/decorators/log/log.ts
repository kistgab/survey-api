import Controller from "../../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";

export default class LogControllerDecorator<Req, Res> implements Controller<Req, Res> {
  constructor(private readonly controller: Controller<Req, Res>) {}

  async handle(httpRequest: HttpRequest<Req>): Promise<HttpResponse<Res>> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      console.error(httpResponse.body);
    }
    return httpResponse;
  }
}
