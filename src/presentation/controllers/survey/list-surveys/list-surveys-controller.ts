import { SurveyModel } from "@src/data/models/survey-model";
import { ListSurveys } from "@src/domain/usecases/survey/list-surveys";
import { internalServerError, noContent, ok } from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

export default class ListSurveysController implements Controller<unknown, SurveyModel[] | null> {
  constructor(private readonly listSurveys: ListSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse<SurveyModel[] | Error | null>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const surveys = await this.listSurveys.list(httpRequest.accountId!);
      if (surveys.length) {
        return ok(surveys);
      }
      return noContent();
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
