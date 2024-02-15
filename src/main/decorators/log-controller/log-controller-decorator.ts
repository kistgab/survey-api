import LogErrorRepository from "../../../data/protocols/db/log/log-error-repository";
import ServerError from "../../../presentation/errors/server-error";
import Controller from "../../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../../presentation/protocols/http";

export default class LogControllerDecorator<Req, Res> implements Controller<Req, Res> {
  constructor(
    private readonly controller: Controller<Req, Res>,
    private readonly logErrorRepository: LogErrorRepository,
  ) {}

  async handle(httpRequest: HttpRequest<Req>): Promise<HttpResponse<Res | Error>> {
    const httpResponse = await this.controller.handle(httpRequest);
    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.logError((httpResponse.body as ServerError).stack ?? "");
    }
    return httpResponse;
  }
}
