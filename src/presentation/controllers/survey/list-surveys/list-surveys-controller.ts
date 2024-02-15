import { SurveyModel } from "../../../../data/models/survey-model";
import { ListSurveys } from "../../../../domain/usecases/list-surveys";
import { internalServerError } from "../../../helpers/http/http-helper";
import Controller from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export default class ListSurveysController implements Controller<unknown, SurveyModel[]> {
  constructor(private readonly listSurveys: ListSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<SurveyModel[] | Error>> {
    try {
      httpRequest;
      await Promise.resolve();
      await this.listSurveys.list();
      return { body: [], statusCode: 200 };
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
