import { InputAnswerSurveyDto, OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
import {
  internalServerError,
  unprocessableContent,
} from "@src/presentation/helpers/http/http-helper";
import Controller from "@src/presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "@src/presentation/protocols/http";

export type AnswerSurveyParams = { surveyId: string };

export class AnswerSurveyController
  implements Controller<InputAnswerSurveyDto, OutputAnswerSurveyDto>
{
  constructor(private readonly listSurveyById: ListSurveyById) {}

  async handle(
    httpRequest: HttpRequest<InputAnswerSurveyDto, AnswerSurveyParams>,
  ): Promise<HttpResponse<OutputAnswerSurveyDto | Error>> {
    try {
      const { params } = httpRequest;
      const survey = await this.listSurveyById.list(params?.surveyId || "");
      if (!survey) return unprocessableContent(new Error("Survey not found"));
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return null!;
    } catch (error) {
      return internalServerError(error as Error);
    }
  }
}
