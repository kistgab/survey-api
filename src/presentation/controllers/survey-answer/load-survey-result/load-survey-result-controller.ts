import { SurveyResultModel } from "@src/data/models/survey-result-model";
import { LoadSurveyResult } from "@src/domain/usecases/survey-answer/load-survey-result";
import {
  internalServerError,
  ok,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

type Params = {
  surveyId: string;
};

export class LoadSurveyResultController implements Controller<void, SurveyResultModel> {
  constructor(private readonly loadSurveyResult: LoadSurveyResult) {}

  async handle(
    httpRequest: HttpRequest<void, Params>,
  ): Promise<HttpResponse<SurveyResultModel | Error>> {
    try {
      if (!httpRequest.params?.surveyId) {
        return unprocessableContent(new Error("surveyId is required"));
      }
      const result = await this.loadSurveyResult.load(httpRequest.params.surveyId);
      if (!result) {
        return unprocessableContent(new Error("surveyId is invalid"));
      }
      return ok(result);
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
