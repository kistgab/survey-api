import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
import { unprocessableContent } from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

type Params = {
  surveyId: string;
};

export class LoadSurveyResultController implements Controller<void, SurveyResultModel> {
  constructor(private readonly loadSurveyById: ListSurveyById) {}

  async handle(
    httpRequest: HttpRequest<void, Params>,
  ): Promise<HttpResponse<SurveyResultModel | Error>> {
    await Promise.resolve(httpRequest);
    if (!httpRequest.params?.surveyId) {
      return unprocessableContent(new Error("surveyId is required"));
    }
    await this.loadSurveyById.list(httpRequest.params.surveyId);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return null!;
  }
}
