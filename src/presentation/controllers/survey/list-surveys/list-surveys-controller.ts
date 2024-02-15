import { SurveyModel } from "../../../../data/models/survey-model";
import { ListSurveys } from "../../../../domain/usecases/list-surveys";
import Controller from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export default class ListSurveysController implements Controller<undefined, SurveyModel[]> {
  constructor(private readonly listSurveys: ListSurveys) {}

  async handle(httpRequest: HttpRequest<undefined>): Promise<HttpResponse<SurveyModel[]>> {
    httpRequest;
    await Promise.resolve();
    await this.listSurveys.list();
    return { body: [], statusCode: 200 };
  }
}
