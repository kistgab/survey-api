import { SurveyModel } from "../../../../data/models/survey-model";
import { ListSurveys } from "../../../../domain/usecases/list-surveys";
import { internalServerError, noContent, ok } from "../../../helpers/http/http-helper";
import Controller from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export default class ListSurveysController implements Controller<unknown, SurveyModel[] | null> {
  constructor(private readonly listSurveys: ListSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<SurveyModel[] | Error | null>> {
    try {
      httpRequest;
      const surveys = await this.listSurveys.list();
      if (surveys.length) {
        return ok(surveys);
      }
      return noContent();
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
