import { InputAnswerSurveyDto, OutputAnswerSurveyDto } from "@src/domain/dtos/answer-survey-dto";
import { ListSurveyById } from "@src/domain/usecases/survey/list-survey-by-id";
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
    const { params } = httpRequest;
    await this.listSurveyById.list(params?.surveyId || "");
    return { body: {} as OutputAnswerSurveyDto, statusCode: 200 };
  }
}
